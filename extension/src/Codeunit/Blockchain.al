codeunit 50100 "Wastechain Management"
{
    procedure CreateWasteOrderOnBlockchain()
    var
        Client: HttpClient;
        ResponseMessage: HttpResponseMessage;
        Content: HttpContent;
        ResponseText: Text;
    begin
        //Client.DefaultRequestHeaders().Add('Content-Type', 'application/json');
        if Client.SetBaseAddress('http://localhost:3000/') then begin
            Message(Client.GetBaseAddress());
            Client.Post('order/new', Content, ResponseMessage);
            ResponseMessage.Content.ReadAs(ResponseText);
            Message(ResponseText);
            // end else
            //     Error('Could not POST: ' + GetLastErrorText);
        end else
            Error('Could not set URI');
    end;
}