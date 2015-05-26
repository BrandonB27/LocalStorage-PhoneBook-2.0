/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
    var contactos = {
	index: window.localStorage.getItem("contactos:index"),
	$table: document.getElementById("Tabla"),
	$form: document.getElementById("Formulario"),
	$guardar: document.getElementById("Guardar"),
        $borrar: document.getElementById("BorrarLocalStorage"),
	$resetear: document.getElementById("Resetear"),

	init: function() 
            {
              if (!contactos.index) 
                {
                    window.localStorage.setItem("contactos:index", contactos.index = 1);
                }
          // Inicializar index
                contactos.$form.reset();
		contactos.$resetear.addEventListener("click", function()
                {
		contactos.$form.reset();
		contactos.$form.flag.value = 0;
		}
                , true);
          // Inicializar Formulario
                
               //*Erasing LocalStorage
                 contactos.$borrar.addEventListener("dblclick", function(){window.localStorage.clear();}, true);
                
		contactos.$form.addEventListener("submit", function()
                {
                    var entrada = 
                        {
			id: parseInt(this.flag.value),
			prinombre: this.prinombre.value,
			ultnombre: this.ultnombre.value,
			tel: this.tel.value
			};
                //Agregar             
                    if (entrada.id == 0)
                        {
                            contactos.Agregar(entrada);
                            contactos.AgregarTabla(entrada);
			}
                    this.reset();
                    this.flag.value = 0;
                    event.preventDefault();
		}
                , true);

           // Inicializar Tabla
		if (window.localStorage.length - 1) 
                    {
                        var contactos_list = [], i, key;
			for (i = 0; i < window.localStorage.length; i++) 
                            {
				key = window.localStorage.key(i);
				if (/contactos:\d+/.test(key)) 
                                {
                                    contactos_list.push(JSON.parse(window.localStorage.getItem(key)));
				}
                            }
                            if (contactos_list.length) 
                            {
                                contactos_list.sort(function(a, b) {
				return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
					}).forEach(contactos.AgregarTabla);
					}
                    }
           //Onclick Events para el boton de eliminar
		contactos.$table.addEventListener("click", function()
                     {
			var op = event.target.getAttribute("data-in");
			if (/eliminar|map/.test(op)) 
                            {
				var entrada = JSON.parse(window.localStorage.getItem("contactos:"+ event.target.getAttribute("data-id")));
                                if (op === "eliminar")
                                    {
					contactos.eliminarguardado(entrada);
					contactos.eliminartabla(entrada);
                                    }
                                if(op == "map")
                                    {
                                        contactos.mapa();
                                    }
				event.preventDefault();
                            }
                    }
                    , true);
            },
        //Metodos
            mapa: function()
            {
                var x = document.getElementById("alerts");
                function getLocation() 
                {
                     if (navigator.geolocation) 
                     {
                        navigator.geolocation.getCurrentPosition(showPosition, showError);
                     } else
                     {
                        x.innerHTML = "Geolocalizacion no esta soportado por este navegador.";
                     }
                }

                function showPosition(position)
                {
                    var latlon = position.coords.latitude + "," + position.coords.longitude;
                    var img_url = "http://maps.googleapis.com/maps/api/staticmap?center="+latlon+"&zoom=14&size=400x300&sensor=false";
                    document.getElementById("mapholder").innerHTML = "<img src='"+img_url+"'>";
                }

                function showError(error) 
                {
                    switch(error.code)
                    {
                        case error.PERMISSION_DENIED:
                        x.innerHTML = "Usuario nego la utilizacion de Geolocalizacion.";
                        break;
                        case error.POSITION_UNAVAILABLE:
                        x.innerHTML = "Informacion de Ubicacion no se Encontro.";
                        break;
                        case error.TIMEOUT:
                        x.innerHTML = "El tiempo de respuesta de busqueda de ubicacion a terminado.";
                        break;
                        case error.UNKNOWN_ERROR:
                        x.innerHTML = "Error desconocido ha ocurrido.";
                        break;
                    }
                }
                getLocation();
            },
            Agregar: function(entrada)
                {
                    entrada.id = contactos.index;
                    window.localStorage.setItem("contactos:index", ++contactos.index);
                    window.localStorage.setItem("contactos:"+ entrada.id, JSON.stringify(entrada));
		},
            eliminarguardado: function(entrada)
                {
                    window.localStorage.removeItem("contactos:"+ entrada.id);
		},
            AgregarTabla: function(entrada) 
                {
                    var $tr = document.createElement("tr"), $td, key;
                    for (key in entrada)
                        {
                            if (entrada.hasOwnProperty(key))
                                {
                                    $td = document.createElement("td");
                                    $td.appendChild(document.createTextNode(entrada[key]));
                                    $tr.appendChild($td);
				}
			}
                    $td = document.createElement("td");
                    $td.innerHTML = '<div class="text-center"><a class="btn btn-info btn-sm" data-in="eliminar" data-id="'+ entrada.id +'"><span class="glyphicon glyphicon-remove"></span>Eliminar</a> | <a class="btn btn-info btn-sm" data-in="map" data-id="'+ entrada.id +'"><span class="glyphicon glyphicon-map-marker"></span>Map</a></div>';
                    $tr.appendChild($td);
                    $tr.setAttribute("id", "entrada-"+ entrada.id);
                    contactos.$table.appendChild($tr);
		},
            eliminartabla: function(entrada) 
                {
                    contactos.$table.removeChild(document.getElementById("entrada-"+ entrada.id));
		}
		};
		contactos.init();
