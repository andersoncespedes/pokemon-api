function Api(api){
    this.data = api;
    this.content = document.getElementById("pokemones");
}
Api.prototype.main = async function(){
    try{
        let res = await fetch("https://pokeapi.co/api/v2/pokemon");
        let data = res.json();  
        return data;
     }
     catch(err){
         console.log(err);
     }
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
    datos.results.forEach(async element => {
        let pokedato =  await this.pokeDatos(element.url);
        this.generador(pokedato)
        console.log(pokedato);
    });
} 
Api.prototype.types = function(types){
    return types.map(e => `<span class = "${e.type.name}">${e.type.name}</span>`);
}
Api.prototype.generador = async function(pokedato){
    let tipos =  this.types(pokedato.types);
    console.log(tipos);
    this.content.innerHTML += `
    <div class = "card">
        
        <img src = "${pokedato.sprites["other"]["official-artwork"]["front_default"]}" class= "imagen">
        <div class = "card-head">
            N ${pokedato.order}
            <h2>${pokedato["name"]}</h2>
        </div>
        <div class = "habilidades">
            ${tipos.join(" ")}
        </div>
    </div>
    `;
}
const api = new Api("https://pokeapi.co/api/v2/pokemon");
api.Rec();