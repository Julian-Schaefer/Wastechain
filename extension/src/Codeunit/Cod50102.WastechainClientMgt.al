codeunit 50102 "Wastechain Client Mgt. WC"
{
    procedure PostWasteOrder(WasteLine: Record "Waste Management Line")
    var
        Response: HttpResponseMessage;
        Content: HttpContent;
        ContentHeaders: HttpHeaders;
        ResponseText: Text;
        CreateWasteOrderJSON: JsonObject;
        CreateWasteOrderJSONText: Text;
    begin
        CreateWasteOrderJSON := WastechainJSONMgt.GenerateCreateWasteOrderJSON(WasteLine);
        CreateWasteOrderJSON.WriteTo(CreateWasteOrderJSONText);
        Content.WriteFrom(CreateWasteOrderJSONText);
        Content.GetHeaders(ContentHeaders);
        ContentHeaders.Remove('Content-Type');
        ContentHeaders.Add('Content-Type', 'application/json;charset=utf-8');
        Post('/order/' + WastechainJSONMgt.GetWasteOrderKey(WasteLine), Content, Response);

        Response.Content.ReadAs(ResponseText);
        if Response.IsSuccessStatusCode then begin
            WasteLine."Waste Order Key WC" := WastechainJSONMgt.GetWasteOrderKeyFromJSONText(ResponseText);
            WasteLine.Modify();
            Message('Successfully commissioned Waste Order to Wastechain.');
        end else
            Error(ResponseText);
    end;

    procedure UpdateWasteOrder(WasteOrderKey: Text; UpdateWasteOrderJSON: JSONObject)
    var
        Response: HttpResponseMessage;
        Content: HttpContent;
        ContentHeaders: HttpHeaders;
        ResponseText: Text;
        UpdateWasteOrderJSONText: Text;
    begin
        UpdateWasteOrderJSON.WriteTo(UpdateWasteOrderJSONText);
        Content.WriteFrom(UpdateWasteOrderJSONText);
        Content.GetHeaders(ContentHeaders);
        ContentHeaders.Remove('Content-Type');
        ContentHeaders.Add('Content-Type', 'application/json;charset=utf-8');
        Put('/order/' + WasteOrderKey, Content, Response);

        Response.Content.ReadAs(ResponseText);
        if Response.IsSuccessStatusCode then begin
            Message('Successfully updated the Waste Order on the Wastechain.');
        end else
            Error(ResponseText);
    end;

    procedure GetWasteOrderAsText(WasteOrderKey: Text): Text
    var
        Response: HttpResponseMessage;
        ResponseText: Text;
    begin
        if WasteOrderKey = '' then
            Error('Please provide a Waste Order Key.');

        Get(StrSubstNo('/order/%1', WasteOrderKey), Response);

        Response.Content.ReadAs(ResponseText);
        if Response.IsSuccessStatusCode then
            exit(ResponseText)
        else
            Error(ResponseText);
    end;

    procedure GetWasteOrderHistoryAsText(WasteOrderKey: Text): Text
    var
        Response: HttpResponseMessage;
        ResponseText: Text;
    begin
        if WasteOrderKey = '' then
            Error('Please provide a Waste Order Key.');

        Get(StrSubstNo('/order/%1/history', WasteOrderKey), Response);

        Response.Content.ReadAs(ResponseText);
        if Response.IsSuccessStatusCode then
            exit(ResponseText)
        else
            Error(ResponseText);
    end;

    procedure GetIncomingWasteOrdersAsText(): Text
    var
        Response: HttpResponseMessage;
        ResponseText: Text;
    begin
        Get('/order/commissioned', Response);

        Response.Content.ReadAs(ResponseText);
        if Response.IsSuccessStatusCode then
            exit(ResponseText)
        else
            Error(ResponseText);
    end;

    procedure UpdateWasteOrderStatus(WasteOrderKey: Text; Status: enum "Waste Order Status WC")
    var
        Response: HttpResponseMessage;
        Content: HttpContent;
        ContentHeaders: HttpHeaders;
        ResponseText: Text;
        UpdateWasteOrderJSONStatusText: Text;
    begin
        WastechainJSONMgt.GetUpdateWasteOrderStatusJSON(Status).WriteTo(UpdateWasteOrderJSONStatusText);
        Content.WriteFrom(UpdateWasteOrderJSONStatusText);
        Content.GetHeaders(ContentHeaders);
        ContentHeaders.Remove('Content-Type');
        ContentHeaders.Add('Content-Type', 'application/json;charset=utf-8');

        Put(StrSubstNo('/order/%1/status', WasteOrderKey), Content, Response);

        Response.Content.ReadAs(ResponseText);
        if Response.IsSuccessStatusCode then
            Message('Successfully updated Waste Order Status to: %1', Format(Status))
        else
            Error(ResponseText);
    end;

    local procedure Get(RelativePath: Text; var Response: HttpResponseMessage)
    var
        WastechainSetup: Record "Wastechain Setup WC";
        Client: HttpClient;
    begin
        WastechainSetup.Get();
        Client.Get(WastechainSetup."API URL" + RelativePath, Response);
    end;

    local procedure Post(RelativePath: Text; Content: HttpContent; var Response: HttpResponseMessage)
    var
        WastechainSetup: Record "Wastechain Setup WC";
        Client: HttpClient;
    begin
        WastechainSetup.Get();
        Client.Post(WastechainSetup."API URL" + RelativePath, Content, Response);
    end;


    local procedure Put(RelativePath: Text; Content: HttpContent; var Response: HttpResponseMessage)
    var
        WastechainSetup: Record "Wastechain Setup WC";
        Client: HttpClient;
    begin
        WastechainSetup.Get();
        Client.Put(WastechainSetup."API URL" + RelativePath, Content, Response);
    end;

    var
        WastechainJSONMgt: Codeunit "Wastechain JSON Mgt. WC";
}