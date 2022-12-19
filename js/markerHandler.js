var modelList = []

AFRAME.registerComponent("marker-handler",{
    init: async function(){
       
        this.el.addEventListener("markerFound",()=>{
            var modelName = this.el.getAttribute("model_name");
            var barcodeValue = this.el.getAttribute("value");

            modelList.push({
                model_name : modelName,
                value : barcodeValue
            })

            var model = document.querySelector(`#${modelName}-${barcodeValue}`);
            model.setAttribute("visible",true);
        })

        this.el.addEventListener("markerLost",()=>{
            var modelName = this.el.getAttribute("model_name");
            var index = modelList.findIndex(x=>x.model_name===modelName);
            if(index>-1){
                modelList.splice(index,1)
            }
        })
    },

    tick:async function(){
        if(modelList.length>1){
           var isBaseModelPresent = this.isModelPresentInArray(modelList,"base");
           var messageText = document.querySelector("#message-text");

           if(!isBaseModelPresent){
              messageText.setAttribute("visible",true);
           }else{
            
             if(models === null){
                models = await this.getModels();
             }else{
                 messageText.setAttribute("visible",false);
                 this.placeTheModel("road",models)
                 this.placeTheModel("sun",models)
                 this.placeTheModel("road",models)
             }
           }
        }
    },

    getModels:async function(){
        return fetch("js/modelList.json")
              .then(res=>res.json())
              .then(data=>data)
    },

    isModelPresentInArray:function(arr,val){
        for(var i of arr){
            if(i.model_name === val){
                return true
            }
       }

       return false
    },

    getDistance:function(elA,elB){
        return elA.object3D.position.distanceTo(elB.object3d.postion);
    },

    getModelGeometry:function(models,modelName){
       var barcodes = Object.keys(models);
       for(var barcode in barcodes){
        if(models[barcode] === modelName){
            return {
                position:models[barcode]["placement_positon"],
                rotation:models[barcode]["placement_rotation"],
                scale:models[barcode]["placement_scale"],
                model_url:models[barcode]["model_url"]
            }
        }
       }
    },

    placeTheModel:function(modelName,models){
        var isListContainsModel = this.isModelPresentInArray(modelList,modelName);
        if(isListContainsModel){
            var distance = null;
            var marker1 = document.querySelector("#marker-base");
            var marker2 = document.querySelector(`#marker-${modelName}`);

            distance = this.getDistance(marker1,marker2);
            if(distance < 1.25){

                var modelEl = document.querySelector(`#${modelName}`);
                modelEl.setAttribute("visible",false);

                var isModelPLaced = document.querySelector(`#Model-${modelName}`);

                if(isModelPLaced === null){
                    
                    var el = document.createElement("a-entity");
                    var modelGeometry = this.getModelGeometry(models,modelName);

                    el.setAttribute("id",`model-${modelName}`);
                    el.setAttribute("gltf-model",`url(${modelGeometry.model_url})`);
                    el.setAttribute("position",modelGeometry.position);
                    el.setAttribute("rotation",modelGeometry.rotation);
                    el.setAttribute("scale",modelGeometry.scale);
                    marker1.appendChild(el);
                }
            }
        }
    }
})