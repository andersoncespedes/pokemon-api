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
Api.prototype.types = async function(types){
    try{
        let arr = types.map( async e =>{ 
        try{
            let data = await fetch(e.type.url);
            return data.json();
        }catch(err){
            
        }
       
    }); 
    }catch(err){
        console.log(err);
    }
    
}
Api.prototype.generador = async function(pokedato){
    let tipos = await this.types(pokedato.types);
    console.log( tipos);
    this.content.innerHTML += `
    <div class = "card">
        <div class = "card-head">
            <h2>${pokedato["name"]}</h2>
        </div>
        <img src = "${pokedato.sprites["front_default"]}">
    </div>
    `;
}
const api = new Api("https://pokeapi.co/api/v2/pokemon");
api.Rec();