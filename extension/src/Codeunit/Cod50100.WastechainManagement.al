codeunit 50100 "Wastechain Management"
{
    procedure PostWasteOrder(WasteLine: Record "Waste Management Line")
    var
        Client: HttpClient;
        ResponseMessage: HttpResponseMessage;
        Content: HttpContent;
        ContentHeaders: HttpHeaders;
        ResponseText: Text;
        WasteOrderJSON: JsonObject;
        WasteOrderJSONText: Text;
    begin
        InitClient(Client);


        //if Client.SetBaseAddress('http://localhost:3000/') then begin

        WasteOrderJSON := GenerateWasteOrderJSON(WasteLine);
        WasteOrderJSON.WriteTo(WasteOrderJSONText);
        Content.WriteFrom(WasteOrderJSONText);
        Content.GetHeaders(ContentHeaders);
        ContentHeaders.Remove('Content-Type');
        ContentHeaders.Add('Content-Type', 'application/json;charset=utf-8');
        Client.Post('http://localhost:3000/order/' + WasteLine."Document No." + '-' + Format(WasteLine."Line No."), Content, ResponseMessage);
        ResponseMessage.Content.ReadAs(ResponseText);
        Message(ResponseText);
        // end else
        //     Error('Could not POST: ' + GetLastErrorText);
        //end else
        //    Error('Could not set URI');
    end;

    procedure InitClient(var Client: HttpClient)
    begin
        //Client.SetBaseAddress('http://localhost:3000/');
    end;

    procedure GenerateWasteOrderJSON(WasteLine: Record "Waste Management Line"): JsonObject
    var
        BusinessPartner: Record "Business Partner";
        BusinessPartnerSite: Record "Business Partner Site";
        Service: Record Service;
        WasteOrderJSON: JsonObject;
        TaskSiteJSON: JsonObject;
        ServiceJSON: JsonObject;
    begin
        with WasteLine do begin
            WasteOrderJSON.Add('description', Description);
            WasteOrderJSON.Add('quantity', Quantity);
            WasteOrderJSON.Add('unitPrice', "Unit Price");

            BusinessPartner.Get("Business-with No.");
            WasteOrderJSON.Add('contractorMSPID', BusinessPartner."Wastechain MSP ID");

            BusinessPartnerSite.Get("Post-with No.", "Task-at Code");
            TaskSiteJSON.Add('address', BusinessPartnerSite.Address);
            TaskSiteJSON.Add('address2', BusinessPartnerSite."Address 2");
            TaskSiteJSON.Add('postCode', BusinessPartnerSite."Post Code");
            TaskSiteJSON.Add('city', BusinessPartnerSite.City);
            TaskSiteJSON.Add('countryCode', BusinessPartnerSite."Country/Region Code");
            TaskSiteJSON.Add('areaCode', BusinessPartnerSite."Area Code");

            WasteOrderJSON.Add('taskSite', TaskSiteJSON);

            Service.Get("No.");
            ServiceJSON.Add('description', Service.Description);
            ServiceJSON.Add('description2', Service."Description 2");

            WasteOrderJSON.Add('service', ServiceJSON);
        end;

        exit(WasteOrderJSON);
    end;
}