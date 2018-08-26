import * as fs from 'fs';
 
const fileStops = fs.readFileSync('scripts/stopsData.txt', 'utf8');
const fileRoutes = fs.readFileSync('scripts/routes.txt', 'utf8');
let jsonStops: any[] = [];
let jsonRoutes: number[] = [];

fileStops.toString().split('\n').forEach(line => {
    const attr = line.split(',');
    jsonStops.push({ id: +attr[0], name: attr[2]});
});

fs.writeFile("src/data/stops.json", JSON.stringify(jsonStops), () => {
    console.log("The file was saved!");
}); 

fileRoutes.toString().split('\n').forEach(line => {
    jsonRoutes.push(+line.split(',')[0]);
});

fs.writeFile("src/data/routes.json", JSON.stringify(jsonRoutes), () => {
    console.log("The file was saved!");
}); 