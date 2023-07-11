function Api(api){
    this.data = api;
    this.content = document.getElementById("pokemones");
}
Api.prototype.main = async function(){
    try{
        let res = await fetch(this.data);
        let data = res.json();  
        return data;
     }
     catch(err){
         console.log(err);
     }
}
Api.prototype.botones = async function(param){
    this.content.innerHTML = "";
    let datos = await this.main();
    if(param == "next"){
        this.data = datos.next;
    }
    else{
        this.data = datos.previous;
    }
    this.Rec();
}
Api.prototype.pokeDatos = async function(param){
    try{
        let res = await fetch(param);
        let data = res.json();
        return data;
    }catch(err){
        console.log(err);
    }
}
Api.prototype.Rec = async function(){
    let datos = await this.main()
    console.log(datos)
    datos.results.forEach(async element => {
        let pokedato =  await this.pokeDatos(element.url);
        this.generador(pokedato)
    });
} 
Api.prototype.types = function(types){
    return types.map(e => `<span class = "${e.type.name} bord">${e.type.name}</span>`);
}
Api.prototype.generador = async function(pokedato){
    let tipos =  this.types(pokedato.types);
    this.content.innerHTML += `
    <div class = "card" id = "${pokedato["name"]}" onclick = "pokeModal(this);">
        <div style = "text-align:center; border:2px solid black; margin:5px; border-radius:10px" class = "b${pokedato.types[0].type["name"]} data">
            <img src = "${pokedato.sprites["front_default"]}" class= "imagen">
        </div>
        
        <div class = "card-head">
            N°${pokedato.id}
            <h2>${pokedato["name"]}</h2>
        </div>
        <div class = "habilidades">
            ${tipos.join(" ")}
        </div>
    </div>
    `;
}
const next = document.getElementById("next");
const prev = document.getElementById("prev");

const api = new Api("https://pokeapi.co/api/v2/pokemon");
api.Rec();
next.addEventListener("click", () => {
    api.botones("next");
})
prev.addEventListener("click", () => {
    api.botones("prev");
})