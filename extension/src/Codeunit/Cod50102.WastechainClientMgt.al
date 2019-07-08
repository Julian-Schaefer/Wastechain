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

    procedure GetIncomingWasteOrders(): Text
    var
        Client: HttpClient;
        Response: HttpResponseMessage;
        ResponseText: Text;
    begin
        InitClient(Client);

        Client.Get('http://localhost:3000/order/commissioned', Response);

        Response.Content.ReadAs(ResponseText);
        if Response.IsSuccessStatusCode then
            exit(ResponseText)
        else
            Error(ResponseText);
    end;

    procedure UpdateWasteOrderStatus(WasteOrder: Record "Waste Order WC"; Status: enum "Waste Order Status WC")
    var
        Client: HttpClient;
        Response: HttpResponseMessage;
        Content: HttpContent;
        ContentHeaders: HttpHeaders;
        ResponseText: Text;
        UpdateWasteOrderJSONStatusText: Text;
    begin
        InitClient(Client);

        WastechainJSONMgt.GetUpdateWasteOrderStatusJSON(Status).WriteTo(UpdateWasteOrderJSONStatusText);
        Content.WriteFrom(UpdateWasteOrderJSONStatusText);
        Content.GetHeaders(ContentHeaders);
        ContentHeaders.Remove('Content-Type');
        ContentHeaders.Add('Content-Type', 'application/json;charset=utf-8');

        Client.Put(StrSubstNo('http://localhost:3000/order/%1/status', WasteOrder."Key"), Content, Response);

        Response.Content.ReadAs(ResponseText);
        if Response.IsSuccessStatusCode then
            Message('Successfully updated Waste Order Status to: %1', Format(Status))
        else
            Error(ResponseText);
    end;

    local procedure InitClient(var Client: HttpClient)
    begin
        //Client.SetBaseAddress('http://localhost:3000/');
    end;

    var
        WastechainJSONMgt: Codeunit "Wastechain JSON Mgt. WC";
}