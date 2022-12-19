AFRAME.registerComponent("model",{
    init:async function(){
      //fetching data and storing it in variable
      var models = await this.getModel();
      var barcodes = Object.keys(models);

      barcodes.map((barcode)=>{
        var model = models[barcode];
        this.createModel(model)
      })
    },
    getModel:async function(){
        return fetch("js/modelList.json")
              .then(res=>res.json())
              .then(data=>data)
    },
    createModel:function(model){
      //creating variables 
      var barcode_value  = model.barcode_value;
      var model_url = model.model_url;
      var model_name = model.model_name;

      var scene = document.querySelector("scene");

      //create marker
      var marker = document.createElement("a-marker");
      marker.setAttribute("id",`marker-${model_name}`); 
      marker.setAttribute("model_name",model_name);
      marker.setAttribute("type","barcode");
      marker.setAttribute("value",barcode_value);
      marker.setAttribute("markerHandler", {});
      scene.appendChild(marker);

      //appending model to markers
      if(barcode_value === 0){
        var modelEl = document.createElement("a-entity");
        modelEl.setAttribute("id",`${model_name}`);
        modelEl.setAttribute("geometry",{
            primitive:"box",
            height:model.height,
            width:model.width
        });
        modelEl.setAttribute("position",model.position);
        modelEl.setAttribute("rotation",model.rotation);
        modelEl.setAttribute("material",{
            color:model.color
        });

        marker.appendChild(modelEl);
      }else{
        var modelEl = document.createElement("a-entity");
        modelEl.setAttribute("id",`${model_name}`);
        modelEl.setAttribute("gltf-model",`url(${model.model_url})`);
        modelEl.setAttribute("position",model.position);
        modelEl.setAttribute("rotation",model.ratation);
        modelEl.setAttribute("scale",model.scale);

        marker.appendChild(modelEl);
      }
    }
})