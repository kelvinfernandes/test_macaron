getData();

async function getData(){
const response = await fetch('/api');
const json = await response.json();

for (item of json) {
const root = document.createElement('div');
const arr = document.createElement('div');
const nom = document.createElement('div');


arr.textContent = `Arrondissement: ${item.ardt_lieu}`;
nom.textContent = `Nom du tournage: ${item.nom_tournage}`;


root.append(arr, nom);
document.body.append(root);
}
console.log(json);

}