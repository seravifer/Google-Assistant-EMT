import * as fs from 'fs';
 
const fileStops = fs.readFileSync('stopsData.txt', 'utf8');
const fileRoutes = fs.readFileSync('routes.txt', 'utf8');
let jsonStops: number[] = [];
let jsonRoutes: number[] = [];

fileStops.toString().split('\n').forEach(line => {
    jsonStops.push(+line.split(',')[0]);
});

fs.writeFile("stops.json", JSON.stringify(jsonStops), () => {
    console.log("The file was saved!");
}); 

fileRoutes.toString().split('\n').forEach(line => {
    jsonRoutes.push(+line.split(',')[0]);
});

fs.writeFile("routes.json", JSON.stringify(jsonRoutes), () => {
    console.log("The file was saved!");
}); 