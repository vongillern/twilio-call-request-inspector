//check to see if the page has been fully loaded every 100ms.
var interval = setInterval(generateDebugger, 100);

function generateDebugger() 
{
    //don't generate anything if a request-container doesn't exist
    //It takes a little while to load, however it is the only source of the AccountSid on the screen
    //so we have to wait for it to load so we know what to send to the console/api/request-inspector
    if ($(".request-container")[0])
        clearInterval(interval);
    else {
        console.log("request-container not found, yet");
        return;
    }
    

    let xhr = new XMLHttpRequest();

    var urlParts = window.location.href.split('/');
    var callId = urlParts[urlParts.length - 1];
    
    var accountSid = $($(".request-container")[0]).text().match(/accountsid=([^&]*)/i)[1];
    
    xhr.open('GET', 'https://www.twilio.com/console/api/request-inspector/' + accountSid + '/' + callId);
    xhr.responseType = 'json';
    
    function htmlDecode(input){
      var e = document.createElement('textarea');
      e.innerHTML = input;
      // handle case of empty input
      return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    }
    function htmlEncode(input) {
        return input.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
            return '&#'+i.charCodeAt(0)+';';
         });
    }
    xhr.onload = function() {
        r = xhr.response;
        
        var careAboutParams = ["SpeechResult", "Confidence", "Digits" ];
       var out = "";
       


        var requestViews = [];

        for(var i=0; i<r.length; i++) 
        {
            msg = r[i];

            var shortUrl = msg.request.fullUrl.match(/https?:\/\/([^/]+)(\/.*)/)[2] ;
            shortUrl = shortUrl.replace(/([0-9A-F]{8})[0-9A-F-]*/ig, '$1…') //shorten guids to first 8 to save horizontal space
            
            var requestView = { fullUrl: msg.request.fullUrl, shortUrl: shortUrl, duration: msg.request.duration };
            requestViews.push(requestView);

            //all of my domains are the same, so I don't want to clutter the output with the full url
            
            
            if (msg.request.parameters)
            {
                var params = msg.request.parameters;
                var tbl = '';
                for(var p=0; p<params.length; p++)
                {
                    if(careAboutParams.includes(params[p].key)) {
                        requestView[params[p].key] = params[p].value;
                        
                    }
                }
                
            }

            


            var body = msg.response.body
                .replace(/&lt;\??xml[^\n]*\n/i, '') //we know its xml. don't waste vertical space
                .replace(/&lt;\/?Response&gt;\n?/ig, '') //we know its a <Response> don't waste vertical space
                //.replace(/^  ( *)/mg, '$1') //kill the first set of indentation
                .replace(/\n/gi, "<br/>")
                
                .replace(/^<br\/?>\n?/im, '') //kill first lin break
                .replace(/<br\/?>\s*$/im, ''); //kill last line break
            var code = '<pre style="padding: 0; margin-left:30px; " class="wrapper  debuggerCode " id="responseBox' + i + '"><code class="xml scrolls">' + body + "</code></pre>";
            
            
            requestView.codeMarkup = (code + "<!--" + i + "-->");
            //out += "\n";

            out += "</div>";
            if(i==4)
            {
                console.log(body);
                debugger;
            }
            
            
        }  
        
        var summaryTable = '<table id="debuggerTable" class="table table-compact table-hover hljs" style="padding: 0; margin: 0; ">';
        summaryTable += '<thead><tr>';
            summaryTable += '<th>ShortUrl</th>';
            summaryTable += '<th>Duration</th>';
            for(var p=0; p<careAboutParams.length; p++)
            {
                summaryTable += '<th>' +careAboutParams[p] + '</th>';
            }
            summaryTable += '</tr></thead><tbody>';
        for(var i=0; i<r.length; i++) 
        {
            summaryTable += '<td style="font-family: Consolas" title="' + requestViews[i].fullUrl +'"><a href="javascript: $(\'#debugRow' + i + '\').toggle()">' + requestViews[i].shortUrl + '</a></td>';
            summaryTable += '<td><small>' + requestViews[i].duration + '</small></td>';
            
            for(var p=0; p<careAboutParams.length; p++)
            {
                summaryTable += '<td>' + requestViews[i][careAboutParams[p]] + '</td>';
            }
            summaryTable += "</tr>";
            
            var colspan = 2 + careAboutParams.length;
            summaryTable += '<tr style="margin:0; padding: 0; display:none;background-color: #DDDDDD; " id="debugRow' + i +'"><td colspan="' +colspan+'" style="margin:0px; padding: 8px;">' + requestViews[i].codeMarkup + "</td></tr>";
        }

        summaryTable += '</tbody></table>\n\n';

        summaryTable = summaryTable.replace(/undefined/g, '');
        

        var header = '<style>.wrapper { margin: auto; width: 100%; } .scrolls { overflow-x: scroll; overflow-y: hidden; white-space:nowrap }</style>';
        header += '<div id="twilioDebuggerExtensionBox" style="background-color: #FFE0E0; padding:10px">';
        header += '<h4 style="margin-top: 0; margin-bottom:10px; ">IVR Debugger</h4>';
        header += summaryTable;
        header += '<a href="javascript: $(\'.debuggerCode\').slideDown()">Show All </a> | <a href="javascript: $(\'.debuggerCode\').slideUp()">Hide All </a><br/>';
        header += '<div style="height: 15px;"></div>';



        $('section[data-s="section-request-inspector"]')
            .prepend(header + out);

        setTimeout(() => {
            hljs.initHighlighting();
            
            //I've worked on this too long. I don't want the response pre/code elements to cause the table to overflow.
            //If you want to improve the project, I'd happily accept a pull request to fix the CSS so this code isn't shit
            var tableWidth = $("#debuggerTable").width(); //christ this is hacky
            tableWidth -= (30 + 16); //subtract left margin and padding
            $(".debuggerCode").css("width", tableWidth + "px"); 
            
        }, 200);
        
        
        //console.log(out);
    };
    
    xhr.send();

}




