const https = require("https");
const fs = require("fs");
const path = require("path");

const url = "https://raw.githubusercontent.com/datameet/maps/master/Country/india-land-simplified.geojson";

https
  .get(url, (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      const geojson = JSON.parse(data);
      const coords = geojson.features[0].geometry.coordinates;
      const BOUNDS = [68.0, 6.5, 97.5, 37.5];
      const [minLng, minLat, maxLng, maxLat] = BOUNDS;
      function toSvg(lng, lat) {
        const x = ((lng - minLng) / (maxLng - minLng)) * 100;
        const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
        return [x.toFixed(2), y.toFixed(2)];
      }
      const points = coords.map((c) => toSvg(c[0], c[1]));
      const pathStr =
        "M " +
        points[0].join(" ") +
        " L " +
        points.slice(1).map((p) => p.join(" ")).join(" L ") +
        " Z";
      const outPath = path.join(process.cwd(), "lib", "india-outline-path.ts");
      const content =
        '/** Generated from datameet/maps India GeoJSON. Do not edit by hand. */\nexport const INDIA_OUTLINE_PATH =\n  "' +
        pathStr.replace(/\\/g, "\\\\").replace(/"/g, '\\"') +
        '";\n';
      fs.writeFileSync(outPath, content);
      console.log("Wrote", outPath, "path length", pathStr.length);
    });
  })
  .on("error", (e) => {
    console.error(e);
    process.exit(1);
  });
