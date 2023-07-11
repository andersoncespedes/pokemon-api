const cont = document.getElementById("pokedato");
        const conta = document.getElementById("pokemonSolo");
        let evolucion_arr = [];
        async function busqueda(arr){
            let reg = /\/(\d+)\/$/
            if(arr["chain"] !== undefined){
                let car = await arr["chain"];
                
                let id = car.species.url.match(reg)[1]
                console.log(id)
                evolucion_arr.push([car, await datoPokemon(id)])
                await busqueda(car)
                return car; 
            }
            if(arr.evolves_to.length == 0) return;
            let car = await arr.evolves_to.find(e => e.evolves_to); 
            let id = car.species.url.match(reg)[1]
            evolucion_arr.push([car, await datoPokemon(id)])
            await busqueda(car)
            
            return car; 
        }
        async function evolvChain(id){
            evolucion_arr = [];
            let evolucion = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${id}`);
            let json = await evolucion.json();
            let cadena = json;
            console.log(await busqueda(cadena))
            return cadena
        }
        async function datoPokemon(id){
            let dato = await fetch("https://pokeapi.co/api/v2/pokemon/"+ id);
            return await dato.json();
        }
        function cerrar(param){
            conta.style.display = "none";
        }
        async function pokeModal(param){
            
            let pokemon = param.getAttribute("id");
            let pokeDato = await datoPokemon(pokemon);
            let stats = pokeDato.stats.map(e => [e.stat.name, e.base_stat]);
            let stados = "";
            let descripcion = await fetch("https://pokeapi.co/api/v2/pokemon-species/" + pokeDato.id);
            let pokeDesc = await descripcion.json();
            let habilidades = "";
            let descom = pokeDesc.evolution_chain.url.match(/\/(\d+)\/$/);
            
            let chainId = descom[1];
            await evolvChain(chainId);
            let evolucion = "";
            evolucion_arr.forEach((e, i) => {
                evolucion +=  `
                <div style = "width:31%; margin:4px">
                    
                    <img src= "${e[1].sprites["front_default"]}">
                    ${e[0].species.name}
                </div>
                
                `
            })
            console.log(evolucion_arr)
            pokeDato.abilities.forEach(e => {
                habilidades += `<li class = "abilities">${e.ability.name}</li>`;
            }
                )
            let desc = pokeDesc.flavor_text_entries.find(e => e.language.name == 'es').flavor_text;
            let tipos = pokeDato.types.map(e => `<span class = "${e.type.name} bord">${e.type.name}</span>`);
            stats.forEach(e => {
                let statdiv =   (e[1] / 255) * 100;
                console.log(statdiv)
                stados += `
                    ${e[0]}: ${e[1]}
                    <div class = " content"> 
                    <div class = "${e[0]}" style = "width:${statdiv.toFixed(2)}%; border-top-left-radius: 10px;border-bottom-left-radius: 10px;">
                    </div>
                </div>`;
            })
            cont.innerHTML = `
            <div class = "side-cont b${pokeDato.types[0].type["name"]}">
                <div class = "poke-img">
                    
                    <div style = "margin:10px; border-radius:10px; text-align:center;">
                        <img style = "max-width:120px; min-width:80px" src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${pokeDato["id"]}.gif">
                        
                    </div>
                    
                    <center><h2> ${pokeDato.name}</h2></center>
                </div>
                <div class = "datos">
                    N°${pokeDato["id"]}
                    <h2>Datos</h2><br>
                    ${stados}
                </div>
            </div>
            <div class = "principal">
                <h2>Tipos</h2>
                 ${tipos.join(" ")}
                <h2>Descripcion</h2>
                ${desc}
                <h2>Habilidades</h2>
                <ul class= "habilid">
                    ${habilidades}
                </ul>
                <div class = "row">
                    <div class = "col">
                        <h2>Peso</h2>
                        ${pokeDato.weight / 10} Kg 
                    </div>
                    <div class = "col">
                        <h2>Altura</h2>
                        ${pokeDato.height / 10} Kg 
                    </div>
                </div>
                <h2>Evoluciones</h2>
                <div class = "evoluciones" id = "evolucion">
                    ${evolucion}
                </div>
                <button onclick = "cerrar(this)">Cerrar</button>
            </div>
            `;
            conta.style.display="flex";
            console.log(pokeDato);
        }