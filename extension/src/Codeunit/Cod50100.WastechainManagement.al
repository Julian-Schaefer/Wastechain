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
}