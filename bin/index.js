#! /usr/bin/env node
import shell from "shelljs";
import mustache from "mustache";
import fastify from "fastify";
import open from "open";
let flatDeps;
void (async function main() {
    // List of packages user wants to see the dependencies
    const packagesArgIndex = process.argv.findIndex((a) => a.toLowerCase() === "--packages");
    const packagesFilter = packagesArgIndex !== -1 ? process.argv[packagesArgIndex + 1] : undefined;
    // Only get the dependents of a specific package
    const packageArgIndex = process.argv.findIndex((a) => a.toLowerCase() === "--package-dependents");
    const packageName = packageArgIndex !== -1 ? process.argv[packageArgIndex + 1] : undefined;
    // Get port number
    const portArgIndex = process.argv.findIndex((a) => a.toLowerCase() === "--port");
    const port = portArgIndex !== -1 ? +process.argv[portArgIndex + 1] : 8080;
    // Get if should not open browser
    const shouldOpenBrowser = process.argv.findIndex((a) => a.toLowerCase() === "--no-open") === -1;
    // Run npm list command
    const result = shell.exec(`npm list --json ${packageName ?? "--all"}`, {
        windowsHide: true,
        silent: true,
    });
    // Parse the result to a JSON object
    const packageInfo = JSON.parse(result.stdout);
    console.log(`Generating dependency graph for: "${packageInfo.name}"...`);
    // Filter dependencies if needed
    if (packagesFilter != null) {
        const packagesFilterList = packagesFilter.split(",").map((d) => d.trim());
        for (const key of Object.keys(packageInfo.dependencies)) {
            if (!packagesFilterList.includes(key)) {
                delete packageInfo.dependencies[key];
            }
        }
    }
    // Flat the dependencies from npm list
    flatDeps = {};
    flatDepsRecursive(packageInfo.dependencies);
    // Turn deps into nodes and edges
    const data = {
        name: packageInfo.name,
        nodes: JSON.stringify(Object.entries(flatDeps).map((dep) => ({
            id: dep[0],
            label: `${dep[0]} V${dep[1].version}`,
            color: { border: dep[1].isRoot ? "green" : "blue" },
        }))),
        edges: JSON.stringify(Object.entries(flatDeps)
            .filter((dep) => !!dep[1].dependencies.length)
            .flatMap((dep) => dep[1].dependencies.map((d) => ({
            from: dep[0],
            to: d,
            arrows: "to",
        })))),
    };
    // Render the UI using mustache
    const html = mustache.render(getTemplate(), data);
    // Initialize server to serve graph
    const app = fastify({
        logger: false,
    });
    app.get("/", (_req, resp) => resp.type("text/html").send(html));
    // Run the server
    app.listen({ port }, (err, address) => {
        if (err)
            throw err;
        console.log(`Done! Visit "${address}" to see dependecy graph.`);
        if (shouldOpenBrowser)
            open(address);
    });
})();
function flatDepsRecursive(deps, parentDepName) {
    if (deps == null)
        return;
    for (const dep of Object.entries(deps)) {
        const depName = dep[0];
        const depInfo = dep[1];
        const isRoot = parentDepName == null;
        if (!isRoot) {
            const parentDep = flatDeps[parentDepName];
            parentDep.dependencies.push(depName);
        }
        if (flatDeps[depName] == null) {
            flatDeps[depName] = {
                version: depInfo.version,
                isRoot,
                dependencies: [],
            };
        }
        flatDepsRecursive(depInfo.dependencies, depName);
    }
}
function getTemplate() {
    return `
<html>
  <head>
    <title>{{name}}'s Dependency Graph</title>
    <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
    <script type="text/javascript">
        function renderGraph() {
            var nodes = new vis.DataSet({{{nodes}}});
            var edges = new vis.DataSet({{{edges}}});
            var container = document.getElementById("dep-graph");
            var data = { nodes: nodes, edges: edges };
            var options = { };
            var network = new vis.Network(container, data, options);
        }
    </script>
    <style>
        body { margin: 0; padding: 0; }
        #dep-graph { width: 100vw; height: 100vh; }
    </style>
  </head>
  <body onload="renderGraph()">
    <div id="dep-graph"></div>
  </body>
</html>
`;
}
