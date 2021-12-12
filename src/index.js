const keyboardData = [
    {Id: 1, Name: "US - United States"},
    {Id: 2, Name: "UK - United Kingdom"},
    {Id: 3, Name: "DK - Denmark"},
    {Id: 4, Name: "SW - Sweden"},
    {Id: 5, Name: "FR - French"},
    {Id: 6, Name: "DE - Germany"},
    {Id: 7, Name: "IT - Italy"},
    {Id: 8, Name: "NO - Norway"},
    {Id: 9, Name: "PT - Portugal"},
    {Id: 10, Name: "ES - Spain"},
  ];

function fillKeyboardContainer(){

    let keyboard = $("#keyboardContainer");
    keyboardData.forEach(keyboardItem => 
        keyboard.append(`<option value="${keyboardItem.Id}" ${keyboardItem.Id == activeKeyboardId ? 'selected' : ''}>
            ${keyboardItem.Name}</option>`
        )
    );
}


function editButton(id){

    $("#contentInput").val("");
    $("#keyId").val(id);

    $("#buttonContentModalTitle").text(`Edit Key Content (KEY ${id})`);

    let existData = dataList.filter(i => i.Id == id);
    if(existData.length > 0){
        let content = existData[0].Data;
        $("#contentInput").val(content);
    }
    $("#buttonContentModal").modal("show");
}


function saveKeyData(){

    var id = $("#keyId").val();
    var data =  $("#contentInput").val();

    if(!isNaN(id))
    {
        var existItem = dataList.filter(i => i.Id == id);
        if(existItem.length > 0)
            existItem[0].Data = data;
        else{
            let item = {
                Id: id,
                Data: data
            };

            dataList.push(item);
        }
    }

    $("#buttonContentModal").modal("hide");
    $("#keyId").val("");
    $("#contentInput").val("");
}

  
function addTab(){
    let el = $("#contentInput");
    el.val(el.val() + "(TAB)");
}

function addEnter(){
    let el = $("#contentInput");
    el.val(el.val() + "(ENTER)");
}

function showButtonKeys(){
    $("#connectDeviceContainer").prop("hidden", true);
    $("#buttonKeysContainer").removeAttr("hidden");
}


function showConnectButtonLoader(){
    $("#connectButton").prop("disabled", true);
    $("#connectButtonText").prop("hidden", true);
    $("#connectButtonLoading").removeAttr("hidden");  
}

function closeConnectButtonLoader(){
    $("#connectButton").removeAttr("hidden");  
    $("#connectButtonText").removeAttr("hidden");  
    $("#connectButtonLoading").prop("hidden", true);
}

function showSendToDeviceLoader(){
    $("#sendToDeviceButton").prop("disabled", true);
    $("#sendToDeviceText").prop("hidden", true);
    $("#sendToDeviceLoading").removeAttr("hidden"); 
    $("#loader").removeAttr("hidden");  
}

function closeSendToDeviceLoader(){
    $("#loader").prop("hidden", true);  
    $("#sendToDeviceButton").removeAttr("disabled");
    $("#sendToDeviceText").removeAttr("hidden");
    $("#sendToDeviceLoading").prop("hidden", true);  
}

function showSuccessAlert(){
    $("#alertModal").modal("show");
}


$("#deviceList").on("change", function(e) {
    if(parseInt(this.value) > 0){
        $("#connectButton").removeAttr("disabled");
    }
    else{
        $("#connectButton").prop("disabled", true);
    }
});


$("#keyboardContainer").on("change", function(e) {
    
    let parsedValue = parseInt(this.value);
    
    if( parsedValue > 0)
        activeKeyboardId = parsedValue
});


function closeButtonKeys(){
    $("#buttonKeysContainer").prop("hidden", true);
    $("#connectDeviceContainer").removeAttr("hidden");
}