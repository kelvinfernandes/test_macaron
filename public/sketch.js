 /*===================================================
                      LAYER               
===================================================*/
    
    var map = L.map('map').setView([48.8589 , 2.3469 ], 13);//Focus sur la ville de paris
    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        osm.addTo(map);


    /*===================================================
                          GEOJSON               
    ===================================================*/
    
    var arrondissements = L.geoJSON(arrondissements).addTo(map);

    const table = [];
    const dejaFiltre = ["films filtrés",]; //un tableau pour la performance, l'efficacité et la rapidité du programme 
    let nom = "", ardt = "";
    let nom_tournage, ardt_lieu;
    
        

        var lieux_de_tournage_a_paris = L.geoJSON(lieux_de_tournage_a_paris, {
            onEachFeature: function (feature, layer) {
                nom = feature.properties.nom_tournage;
                ardt = feature.properties.ardt_lieu;

               
                nom = nom.toLowerCase().trim();
                ardt = ardt.toLowerCase().trim();
                let param = 'postData('+nom+')';
                 layer.bindPopup(
                    "<div><b>Nom du tournage:"+nom+"</b>"
                    +"<br /><b>Arrondissement:"+ardt+"</b>"
                    +"<br />"
                    +"<button onclick='"+param+"' >Filtrer</button>"
                    
                );

                

                table.push({
                    "id": nom,
                    "data": [
                        {
                            "nom_tournage": nom,
                            "ardt_lieu": ardt,
                        },
                    ]});

                console.log(table);

                
            }
        }).addTo(map);

         async function postData(id) {

             nom = id.toLowerCase().trim();


            for (let j = 0; j < dejaFiltre.length; j++) { 
                if(dejaFiltre[j]["nom_tournage"] != id){


                for (let i = 0; i < table.length; i++) {
                 
                    if(table[i]["id"] == id){


                       
                        nom_tournage = table[i]["data"][0]["nom_tournage"];
                        ardt_lieu = table[i]["data"][0]["ardt_lieu"];
  
                        dejaFiltre.push({
                            "nom_tournage": nom_tournage
                        });


                    }

             }
            }
        }
                
               
               

                 const data = { nom_tournage, ardt_lieu };
                 nom_tournage = "";
                 ardt_lieu = "";

                 const options = {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json'
                 },
                 body: JSON.stringify(data)
                 };
                 
                
                 const response = await fetch('/api', options);
                 const json = await response.json();
                 console.log(json);



            }





// Google Map Layer

googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
 });
 googleStreets.addTo(map);


/*===================================================
                      LAYER CONTROL               
===================================================*/

var baseLayers = {
    "Google Map":googleStreets,
    "OpenStreetMap": osm,
};

var overlays = {
    "Arrondissements": arrondissements,
    "Lieux de tournage":lieux_de_tournage_a_paris,
};

L.control.layers(baseLayers, overlays).addTo(map);