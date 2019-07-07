codeunit 50102 "Wastechain Client Mgt. WC"
{
    procedure PostWasteOrder(WasteLine: Record "Waste Management Line")
    var
        Client: HttpClient;
        Response: HttpResponseMessage;
        Content: HttpContent;
        ContentHeaders: HttpHeaders;
        ResponseText: Text;
        CreateWasteOrderJSON: JsonObject;
        CreateWasteOrderJSONText: Text;
    begin
        InitClient(Client);

        CreateWasteOrderJSON := WastechainJSONMgt.GenerateCreateWasteOrderJSON(WasteLine);
        CreateWasteOrderJSON.WriteTo(CreateWasteOrderJSONText);
        Content.WriteFrom(CreateWasteOrderJSONText);
        Content.GetHeaders(ContentHeaders);
        ContentHeaders.Remove('Content-Type');
        ContentHeaders.Add('Content-Type', 'application/json;charset=utf-8');
        Client.Post('http://localhost:3000/order/' + WastechainJSONMgt.GetWasteOrderKey(WasteLine), Content, Response);

        Response.Content.ReadAs(ResponseText);
        if Response.IsSuccessStatusCode then begin
            WasteLine."Wastechain Key" := WastechainJSONMgt.GetWasteOrderKeyFromJSONText(ResponseText);
            WasteLine.Modify();
            Message('Successfully commissioned Waste Order to Wastechain.');
        end else
            Error(ResponseText);
    end;

    procedure UpdateWasteOrder(WasteOrderKey: Text; UpdateWasteOrderJSON: JSONObject)
    var
        Client: HttpClient;
        Response: HttpResponseMessage;
        Content: HttpContent;
        ContentHeaders: HttpHeaders;
        ResponseText: Text;
        UpdateWasteOrderJSONText: Text;
    begin
        InitClient(Client);

        UpdateWasteOrderJSON.WriteTo(UpdateWasteOrderJSONText);
        Content.WriteFrom(UpdateWasteOrderJSONText);
        Content.GetHeaders(ContentHeaders);
        ContentHeaders.Remove('Content-Type');
        ContentHeaders.Add('Content-Type', 'application/json;charset=utf-8');
        Client.Put('http://localhost:3000/order/' + WasteOrderKey, Content, Response);

        Response.Content.ReadAs(ResponseText);
        if Response.IsSuccessStatusCode then begin
            Message('Successfully updated the Waste Order on the Wastechain.');
        end else
            Error(ResponseText);
    end;

    procedure GetWasteOrderHistoryAsText(WastechainKey: Text): Text
    var
        Client: HttpClient;
        Response: HttpResponseMessage;
        ResponseText: Text;
    begin
        if WastechainKey = '' then
            Error('Please provide a Wastechain Key.');

        InitClient(Client);

        Client.Get(StrSubstNo('http://localhost:3000/order/%1/history', WastechainKey), Response);

        Response.Content.ReadAs(ResponseText);
        if Response.IsSuccessStatusCode then
            exit(ResponseText)
        else
            Error(ResponseText);
    end;

    procedure InitClient(var Client: HttpClient)
    begin
        //Client.SetBaseAddress('http://localhost:3000/');
    end;

    var
        WastechainJSONMgt: Codeunit "Wastechain JSON Mgt. WC";
}