/* Week 6 TUMBA Guy-Jeef */

// function

const getPokemonSpeciesCount = async () => {
	const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon-species/?limit=1"
  );

  if(response.status != 200 ){
  	return null;
  }else{

  	 data = await response.json();
  	 return data.count ;

  }

}

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;



const getPkmData = async (pkmID) => {
	const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon/"+pkmID
  );

  if(response.status != 200 ){
  	return null;
  }else{
  	 return response.json() ;
  }

}

const getPkmSpeciesData = async (pkmID) => {
	const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon-species/"+pkmID
  );
  if(response.status != 200 ){
  	return null;
  }else{
  	 return response.json() ;
  }
}


const showPokemon = async (pkmInfo) => {
		if(pkmInfo){
		  getPkmSpeciesData(pkmInfo.id)
			.then( specyData => {
				return { pkm: pkmInfo , specy : specyData };
			})
			.then(pkmData => {
				 document.querySelector("#pkm_id").innerHTML = pkmData.pkm.id;
				 document.querySelector("#pkm_name").innerHTML = pkmData.pkm.name;
				 document.querySelector("#pkm_weight").innerHTML = pkmData.pkm.weight;
				 document.querySelector("#pkm_height").innerHTML = pkmData.pkm.height;
				 document.querySelector(".pkm_img_default").src = pkmData.pkm.sprites.other['official-artwork'].front_default;
				 document.querySelector(".pkm_img_shiny").src = pkmData.pkm.sprites.other['official-artwork'].front_shiny;
				 //document.querySelector("#pkm_name").innerHTML = pkmData.name;
				 //stats
				 document.querySelector("#pkm_stats").innerHTML = '';
				 for (var i = 0; i < pkmData.pkm.stats.length; i++) {
					 stat_row = document.createElement("tr");
			    	stat_row.innerHTML = oneStat
							.replace('__stat_name__', pkmData.pkm.stats[i].stat.name)
							.replace('__stat_value__', pkmData.pkm.stats[i].base_stat)
							.replace('__stat_progression__', (pkmData.pkm.stats[i].base_stat * (100.0/255.0) ) ) ;
					 document.querySelector("#pkm_stats").appendChild(stat_row);
				 }

				 let pokedex_entries = pkmData.specy.flavor_text_entries;
				 let pokedex_en_entries = pokedex_entries.filter((entry) => {
		    	return (entry.language.name == 'en');
		     })

			  document.querySelector("#pkm_pokedex_entry").innerHTML = "";

			  if(pokedex_en_entries[0]){
			    document.querySelector("#pkm_pokedex_entry").innerHTML = pokedex_en_entries[0]['flavor_text'];
			  }

			  //abilities

			  document.querySelector("#pkm_abilities").innerHTML = '';
				for (var i = 0; i < pkmData.pkm.abilities.length; i++) {
					abilityItem = document.createElement("div");
					abilityItem.style.display = 'contents';
			    abilityItem.innerHTML = oneAbility
						.replace('__ability_name__', pkmData.pkm.abilities[i].ability.name)
						.replace('__ability_hidden__', (pkmData.pkm.abilities[i].is_hidden)? '<span title="hidden"><i class="fa fa-eye mx-2"></i></span>' : '' );
					document.querySelector("#pkm_abilities").appendChild(abilityItem);
				 }


				document.querySelector("#pkm_types").innerHTML = '';
				for (var i = 0; i < pkmData.pkm.types.length; i++) {
					typeItem = document.createElement("div");
					typeItem.style.display = 'contents';
			    typeItem.innerHTML = oneType
						.replaceAll('__type_name__', pkmData.pkm.types[i].type.name);
						//.replace('__ability_hidden__', (pkmData.pkm.abilities[i].is_hidden)? '<span title="hidden"><i class="fa fa-eye mx-2"></i></span>' : '' );
					document.querySelector("#pkm_types").appendChild(typeItem);
				}



				document.querySelector('#pokemon').classList.remove('visually-hidden');
				document.querySelector('#error').classList.add('visually-hidden');

			});
		}else{

			document.querySelector('#pokemon').classList.add('visually-hidden');
			document.querySelector('#error').classList.remove('visually-hidden');

		}
}

const search = () => {
  let input = document.querySelector('#pokemon_search').value;
	getPkmData(input).then(pkmInfo => { showPokemon(pkmInfo); } );
}


var oneStat = '<th class="text-right w-25">__stat_name__</th>'+
              '<td class="text-right w-10">__stat_value__</td>'+
              '<td class="p-3">'+
                '<div class="progress w-100">'+
                  '<div class="progress-bar" role="progressbar" style="width:__stat_progression__%" aria-valuenow="__stat_value__" aria-valuemin="5" aria-valuemax="255"></div>'+
                '</div>'+
              '</td>';

var oneAbility = '<button class="btn btn-outline-dark mx-2 " style="border-radius: 50px;">'+
                    '__ability_name__ __ability_hidden__'+
                  '</button>';

var oneType = '<button class="btn text-white type-__type_name__ mx-2"> <span> <img src="./img/types/__type_name__.svg" class="mx-2" style="height: 20px ; width : 20px;" /> </span>  __type_name__ </button>';

// Step 1: Pokemon of day

let pokemon = document.querySelector("#pokemon");

if(pokemon !== null){
	getPokemonSpeciesCount()
	.then(numberOfPokemon => {
		return random(1 , parseInt(numberOfPokemon) + 1) ;
	})
	.then(pkmID => {
		return getPkmData(pkmID);
	})
	.then(pkmInfo => {
		showPokemon(pkmInfo);
	});
}



let pokemon_search = document.querySelector("#pokemon_search");
let make_search = document.querySelector("#make_search");

if( (pokemon_search !== null) && (make_search !== null) ){
	document.querySelector("#make_search").addEventListener('click', search) ;
}


