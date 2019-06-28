codeunit 50100 "Wastechain Management"
{
    procedure CreateWasteOrderOnBlockchain(WasteHeader: Record "Waste Management Header")
    var
        Client: HttpClient;
        ResponseMessage: HttpResponseMessage;
        Content: HttpContent;
        ResponseText: Text;
        WasteOrder: Record "Waste Order WC";
        asd: Text;
    begin
        WasteOrder.Init();
        WasteOrder.Id := 'test001';
        WasteOrder.Description := 'Test-Description';
        WasteOrder.Address := 'Address 1';
        WasteOrder.Insert();

        WasteOrder.ConvertToJSON().WriteTo(asd);
        Message(asd);

        InitClient(Client);
        //if Client.SetBaseAddress('http://localhost:3000/') then begin
        Message(Client.GetBaseAddress());
        Client.Post('/order/new', Content, ResponseMessage);
        ResponseMessage.Content.ReadAs(ResponseText);
        Message(ResponseText);
        // end else
        //     Error('Could not POST: ' + GetLastErrorText);
        //end else
        //    Error('Could not set URI');
    end;

    local procedure InitClient(var Client: HttpClient)
    begin
        Client.DefaultRequestHeaders.Remove('Content-Type');
        Client.DefaultRequestHeaders().Add('Content-Type', 'application/json;charset=utf-8');
        Client.SetBaseAddress('http://localhost:3000');
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

            BusinessPartnerSite.Get("Task-at Code");
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
    end;
}