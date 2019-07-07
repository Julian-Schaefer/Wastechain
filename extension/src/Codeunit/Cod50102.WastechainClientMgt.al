codeunit 50102 "Wastechain Client Mgt. WC"
{
    procedure PostWasteOrder(WasteLine: Record "Waste Management Line")
    var
        Client: HttpClient;
        Response: HttpResponseMessage;
        Content: HttpContent;
        ContentHeaders: HttpHeaders;
        ResponseText: Text;
        WasteOrderJSON: JsonObject;
        WasteOrderJSONText: Text;
    begin
        InitClient(Client);

        WasteOrderJSON := WastechainJSONMgt.GenerateCreateWasteOrderJSON(WasteLine);
        WasteOrderJSON.WriteTo(WasteOrderJSONText);
        Content.WriteFrom(WasteOrderJSONText);
        Content.GetHeaders(ContentHeaders);
        ContentHeaders.Remove('Content-Type');
        ContentHeaders.Add('Content-Type', 'application/json;charset=utf-8');
        Client.Post('http://localhost:3000/order/' + WasteLine."Document No." + '-' + Format(WasteLine."Line No."), Content, Response);

        Response.Content.ReadAs(ResponseText);
        if Response.IsSuccessStatusCode then begin
            WasteLine."Wastechain Key" := WastechainJSONMgt.GetWasteOrderKeyFromJSONText(ResponseText);
            WasteLine.Modify();
            Message('Successfully commissioned Order to Wastechain.');
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