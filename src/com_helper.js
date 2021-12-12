var SerialPort = require('serialport');

const handShakeFlag = "#:PandoraKeysApp:#";
const handShakeResponseFlag = "#:PandoraKeysDevice:#";
const dataFlag = "#:PKData:#";
const keyboardFlag = "#:PKKeyboard:#";
const dataResponseFlag = "#:PKOK:#";

var deviceList = [];
var dataList = [];
var dataListForTransfer = [];
var activeKeyboardId = 2;
var isWaitingDataResponse = false;
var isFinishedDataTransfer = true;
var activePort = null;


function listDevice(){

  deviceList = [];
  SerialPort.list().then(ports => {

    var i = 1;
    var deviceListContainer = $("#deviceList");
    $(".deviceItem").remove();
    console.log(ports);
    ports.forEach(port => {

      let item = {
        Id: i,
        Path: port.path,
        Name: "Device " + i + " (" + port.path+ ")"
      };
      
      deviceList.push(item);
      deviceListContainer.append(`<option class="deviceItem" value="${item.Id}">${item.Name}</option>`);
      i++;
    });
  });
}


function connectToDevice(){

  showConnectButtonLoader();

  const port = new SerialPort(deviceList[0].Path);
  port.on("open", () => {

    activePort = port;

    port.on('readable', function () {
      let data = port.read().toString();
      
      let hasConnectedResponse = data.startsWith(handShakeResponseFlag);
      if(hasConnectedResponse){
        console.log(data);
        let keyData = data.substr(handShakeResponseFlag.length);      
        resolveData(keyData);
        fillKeyboardContainer();
        showButtonKeys();
        closeConnectButtonLoader();
      }

      if(isWaitingDataResponse && data == dataResponseFlag )
      {
        if(dataListForTransfer.length > 0 || !isFinishedDataTransfer) sendToDevice(); //continue transfer
        else{
          isWaitingDataResponse = false;
          closeSendToDeviceLoader();
          showSuccessAlert();
        }
      }

      port.flush();
    });
    console.log("opened!");
    port.write(handShakeFlag);
  
  });
}


function resolveData(jsonData){

  if(jsonData == undefined || jsonData == null)
    return; 
    
  var data = JSON.parse(jsonData);
  activeKeyboardId = data["keyboard"];

  dataList.push({ Id: 1, Data: data["1"] });
  dataList.push({ Id: 2, Data: data["2"] });
  dataList.push({ Id: 3, Data: data["3"] });
  dataList.push({ Id: 4, Data: data["4"] });
  dataList.push({ Id: 5, Data: data["5"] });
  dataList.push({ Id: 6, Data: data["6"] });
  
  console.log(dataList);
}


function sendToDevice(){
  
  showSendToDeviceLoader();

  if(dataListForTransfer.length == 0 && !isWaitingDataResponse)
    dataListForTransfer = dataList.map(item => Object.assign({}, item)).reverse();
  
  var payload = "";
  
  if(!isWaitingDataResponse){
    payload = `${keyboardFlag}${activeKeyboardId.toString()}`;
    isFinishedDataTransfer=false;
    isWaitingDataResponse = true;
  }
  else if(isWaitingDataResponse && dataListForTransfer.length > 0){
    var item = dataListForTransfer.pop();
    payload = `${dataFlag}${item.Id.toString()}${item.Data.toString()}`;
  }
  else{
    payload = dataResponseFlag;
    isFinishedDataTransfer = true;
  }
  
  console.log(payload);
  activePort.write(payload);
}




function releaseActivePort(){
  if(activePort != undefined && activePort != null)
    activePort.close();
  
  closeButtonKeys();
  dataListForTransfer = dataList = [];
  deviceList = [];
}