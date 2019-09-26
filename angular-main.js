var app = angular.module("app", [])
.controller("HelloWorldCtrl", function($scope) {  

})

app.directive('cameraDirective', function($compile,$timeout,$window) {
    function isMobileDevice() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }
    return {
        restrict : 'EAC',
        template : '<div class="row">'
        +'<video id="video"></video>'
        +' <div id="sourceSelectPanel" style="display:none">'
        +' <select id="sourceSelect" style="max-width:400px"> </select> </div> '
        +'<!--<pre><input type="hidden" id="barcodeResult" name="barcodeResult" value="-"></input></pre> --!></div></div>',
        replace : true,
        scope : {
          showvalue: "=",
          barcodeValue : "="
        },
        link: function(scope,element,attrs){     
          window.addEventListener('load', function () {
              let selectedDeviceId;
              const hints = new Map();
  
              hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [
                  ZXing.BarcodeFormat.CODE_128,
                  ZXing.BarcodeFormat.EAN_13,
                  ZXing.BarcodeFormat.EAN_8,
                  ZXing.BarcodeFormat.CODE_39
              ]);
  
              const codeReader = new ZXing.BrowserBarcodeReader(hints);
              codeReader.getVideoInputDevices()
                  .then((videoInputDevices) => {
                    document.getElementById("videoInputDevices").innerHTML = videoInputDevices

                      const sourceSelect = document.getElementById('sourceSelect')
                        document.getElementById("sourceSelect").innerHTML ="ismobile"+isMobileDevice()
                    
                      if (isMobileDevice() == true) {
                          selectedDeviceId = videoInputDevices[0].deviceId
                      }
                      else {
                          selectedDeviceId = videoInputDevices[0].deviceId
                          if (selectedDeviceId == 'undefined' || selectedDeviceId == null) {
                              console.warn("Cihazda kamera düşük çözünürlüklü ");
                          } else {
  
                              if (videoInputDevices.length >= 1) {
                              
                                  videoInputDevices.forEach((element) => {
                                      const sourceOption = document.createElement('option')
                                      sourceOption.text = element.label
                                      sourceOption.value = element.deviceId
                                      sourceSelect.appendChild(sourceOption)
                                  })
                              
                                  sourceSelect.onchange = () => {
                                      selectedDeviceId = sourceSelect.value;
                                  };
                              
                                  const sourceSelectPanel = document.getElementById('sourceSelectPanel')
                                  sourceSelectPanel.style.display = 'block'
                              }
                          }
                      }
                      codeReader.decodeFromInputVideoDevice(selectedDeviceId, 'video')
                      .then((result) => {
                          scope.showvalue = result.text
                          document.getElementById("barcodeResult").value = scope.showvalue;
                          //document ile html içine set edebiliyorum.
                      }).catch((err) => {
                          console.error(err)
                      })
                  })
                  .catch((err) => {
                      console.error(err)
                  })
          })
        }
      
       
    };
});
