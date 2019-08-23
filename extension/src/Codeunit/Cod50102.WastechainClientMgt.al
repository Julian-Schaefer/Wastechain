codeunit 50102 "Wastechain Client Mgt. WC"
{
    procedure PostWasteOrder(WasteLine: Record "Waste Management Line")
    var
        Response: HttpResponseMessage;
        Content: HttpContent;
        ContentHeaders: HttpHeaders;
        ResponseText: Text;
        WasteOrderCommissionJSON: JsonObject;
        WasteOrderCommissionJSONText: Text;
    begin
        WasteOrderCommissionJSON := WastechainJSONMgt.CreateWasteOrderCommissionSchemaJSON(WasteLine);
        WasteOrderCommissionJSON.WriteTo(WasteOrderCommissionJSONText);
        Content.WriteFrom(WasteOrderCommissionJSONText);
        Content.GetHeaders(ContentHeaders);
        ContentHeaders.Remove('Content-Type');
        ContentHeaders.Add('Content-Type', 'application/json;charset=utf-8');
        Post('/order/' + WastechainJSONMgt.GetWasteOrderID(WasteLine), Content, Response);

        Response.Content.ReadAs(ResponseText);
        if Response.IsSuccessStatusCode then begin
            WasteLine."Waste Order ID WC" := WastechainJSONMgt.GetWasteOrderIDFromJSONText(ResponseText);
            WasteLine.Modify();
            Message('Successfully commissioned Waste Order to Wastechain.');
        end else
            Error(ResponseText);
    end;

    procedure UpdateWasteOrder(WasteOrderID: Text; WasteOrderUpdateJSON: JSONObject)
    var
        Response: HttpResponseMessage;
        Content: HttpContent;
        ContentHeaders: HttpHeaders;
        ResponseText: Text;
        WasteOrderUpdateJSONText: Text;
    begin
        WasteOrderUpdateJSON.WriteTo(WasteOrderUpdateJSONText);
        Content.WriteFrom(WasteOrderUpdateJSONText);
        Content.GetHeaders(ContentHeaders);
        ContentHeaders.Remove('Content-Type');
        ContentHeaders.Add('Content-Type', 'application/json;charset=utf-8');
        Put('/order/' + WasteOrderID, Content, Response);

        Response.Content.ReadAs(ResponseText);
        if Response.IsSuccessStatusCode then begin
            Message('Successfully updated Waste Order "%1" on the Wastechain.', WasteOrderID);
        end else
            Error(ResponseText);
    end;

    procedure GetWasteOrderAsText(WasteOrderID: Text): Text
    var
        Response: HttpResponseMessage;
        ResponseText: Text;
    begin
        if WasteOrderID = '' then
            Error('Please provide a Waste Order ID.');

        Get(StrSubstNo('/order/%1', WasteOrderID), Response);

        Response.Content.ReadAs(ResponseText);
        if Response.IsSuccessStatusCode then
            exit(ResponseText)
        else
            Error(ResponseText);
    end;

    procedure GetWasteOrderHistoryAsText(WasteOrderID: Text): Text
    var
        Response: HttpResponseMessage;
        ResponseText: Text;
    begin
        if WasteOrderID = '' then
            Error('Please provide a Waste Order ID.');

        Get(StrSubstNo('/order/%1/history', WasteOrderID), Response);

        Response.Content.ReadAs(ResponseText);
        if Response.IsSuccessStatusCode then
            exit(ResponseText)
        else
            Error(ResponseText);
    end;

    procedure GetIncomingWasteOrdersWithStatusAsText(Status: enum "Waste Order Status WC"): Text
    var
        Response: HttpResponseMessage;
        ResponseText: Text;
    begin
        Get(StrSubstNo('/order/incoming/status/%1', Format(Status, 0, 2)), Response);

        Response.Content.ReadAs(ResponseText);
        if Response.IsSuccessStatusCode then
            exit(ResponseText)
        else
            Error(ResponseText);
    end;

    procedure GetOutgoingWasteOrdersWithStatusAsText(Status: enum "Waste Order Status WC"): Text
    var
        Response: HttpResponseMessage;
        ResponseText: Text;
    begin
        Get(StrSubstNo('/order/outgoing/status/%1', Format(Status, 0, 2)), Response);

        Response.Content.ReadAs(ResponseText);
        if Response.IsSuccessStatusCode then
            exit(ResponseText)
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