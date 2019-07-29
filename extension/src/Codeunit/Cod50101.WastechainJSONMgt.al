codeunit 50101 "Wastechain JSON Mgt. WC"
{
    procedure GenerateCreateWasteOrderJSON(WasteLine: Record "Waste Management Line"): JsonObject
    var
        BusinessPartner: Record "Business Partner";
        BusinessPartnerSite: Record "Business Partner Site";
        Service: Record Service;
        Item: Record Item;
        IntMaterialCatalog: Record "Global Int. Material Catalog";
        Equipment: Record Equipment;
        WasteOrderJSON: JsonObject;
        TaskSiteJSON: JsonObject;
        ServiceJSON: JsonObject;
    begin
        with WasteLine do begin
            BusinessPartner.Get("Post-with No.");
            WasteOrderJSON.Add('subcontractorMSPID', BusinessPartner."Wastechain MSP ID");

            BusinessPartner.Get("Bal. Acc. Post-with No.");
            WasteOrderJSON.Add('customerName', BusinessPartner.Name);

            WasteOrderJSON.Add('description', Description);
            WasteOrderJSON.Add('quantity', Quantity);
            WasteOrderJSON.Add('unitPrice', "Unit Price");
            WasteOrderJSON.Add('unitOfMeasure', "Unit of Measure");
            WasteOrderJSON.Add('taskDate', Format("Task Date", 0, '<Month,2>/<Day,2>/<Year4>'));
            if "Starting Time" <> 0T then
                WasteOrderJSON.Add('startingTime', Format("Starting Time"));
            if "Finishing Time" <> 0T then
                WasteOrderJSON.Add('finishingTime', Format("Finishing Time"));
            WasteOrderJSON.Add('referenceNo', "Document No.");
            if "Weighbridge Ticket No." <> '' then
                WasteOrderJSON.Add('weighbridgeTicketNo', "Weighbridge Ticket No.");

            BusinessPartnerSite.Get("Bal. Acc. Post-with No.", "Bal. Acc. Task-at Code");
            TaskSiteJSON.Add('name', BusinessPartnerSite.Name);
            TaskSiteJSON.Add('name2', BusinessPartnerSite."Name 2");
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
            if Service."Material Reference Type" = Service."Material Reference Type"::Item then begin
                Item.Get(Service."Int. Material Catalog");
                ServiceJSON.Add('materialDescription', Item.Description);
            end else begin
                IntMaterialCatalog.Get(Service."Int. Material Catalog");
                ServiceJSON.Add('materialDescription', IntMaterialCatalog.Description);
            end;
            ServiceJSON.Add('equipmentType', Format(Service."Equipment Type"));
            Equipment.Get(Service."Equipment No.");
            ServiceJSON.Add('equipmentDescription', Equipment.Description);

            WasteOrderJSON.Add('service', ServiceJSON);
        end;

        exit(WasteOrderJSON);
    end;

    procedure GenerateUpdateWasteOrderJSON(OldWasteLine: Record "Waste Management Line"; NewWasteLine: Record "Waste Management Line"): JsonObject
    var
        Service: Record Service;
        WasteOrderJSON: JsonObject;
    begin
        if OldWasteLine.Quantity <> NewWasteLine.Quantity then
            WasteOrderJSON.Add('quantity', NewWasteLine.Quantity);

        if OldWasteLine."Unit Price" <> NewWasteLine."Unit Price" then
            WasteOrderJSON.Add('unitPrice', NewWasteLine."Unit Price");

        exit(WasteOrderJSON);
    end;

    procedure GetWasteOrderKey(WasteLine: Record "Waste Management Line"): Text
    begin
        exit(WasteLine."Document No." + '-' + Format(WasteLine."Line No."));
    end;

    procedure GetWasteOrderKeyFromJSONText(JSONText: Text): Text
    var
        JSON: JsonObject;
        Token: JsonToken;
        TokenText: Text;
    begin
        JSON.ReadFrom(JSONText);
        JSON.Get('key', Token);
        exit(Token.AsValue().AsText());
    end;

    procedure GetWasteOrderTransactionHistoryFromText(TransactionHistoryText: Text; var WasteOrder: Record "Waste Order Transaction WC" temporary)
    var
        TransactionHistoryJSONArray: JsonArray;
        TransactionJSONToken: JsonToken;
        ValueJSONToken: JsonToken;
        WasteOrderJSONToken: JsonToken;
        WasteOrderJSONObject: JsonObject;
    begin
        TransactionHistoryJSONArray.ReadFrom(TransactionHistoryText);

        foreach TransactionJSONToken in TransactionHistoryJSONArray do begin
            with WasteOrder do begin
                Init();
                TransactionJSONToken.AsObject().Get('txId', ValueJSONToken);
                "Transaction ID" := ValueJSONToken.AsValue().AsText();

                TransactionJSONToken.AsObject().Get('timestamp', ValueJSONToken);
                "Transaction Timestamp" := ValueJSONToken.AsValue().AsText();

                // Waste Order
                TransactionJSONToken.AsObject().Get('value', WasteOrderJSONToken);
                WasteOrderJSONObject := WasteOrderJSONToken.AsObject();

                WasteOrderJSONObject.Get('status', ValueJSONToken);
                Status := ValueJSONToken.AsValue().AsOption();

                WasteOrderJSONObject.Get('quantity', ValueJSONToken);
                Quantity := ValueJSONToken.AsValue().AsDecimal();

                WasteOrderJSONObject.Get('unitPrice', ValueJSONToken);
                "Unit Price" := ValueJSONToken.AsValue().AsDecimal();

                Insert();
            end;
        end;
    end;

    procedure GetWasteOrdersFromText(WasteOrdersText: Text; var WasteOrder: Record "Waste Order WC" temporary)
    var
        WasteOrderJSONArray: JsonArray;
        WasteOrderJSONToken: JsonToken;
        WasteOrderText: Text;
    begin
        WasteOrderJSONArray.ReadFrom(WasteOrdersText);

        foreach WasteOrderJSONToken in WasteOrderJSONArray do begin
            WasteOrderText := Format(WasteOrderJSONToken.AsObject());
            GetWasteOrderFromText(WasteOrderText, WasteOrder);
            WasteOrder.Insert();
        end;
    end;

    procedure GetWasteOrderFromText(WasteOrderText: Text; var WasteOrder: Record "Waste Order WC")
    var
        WasteOrderJSONObject: JsonObject;
        ValueJSONToken: JsonToken;
        ServiceJSONToken: JsonToken;
        ServiceJSONObject: JsonObject;
        TaskSiteJSONToken: JsonToken;
        TaskSiteJSONObject: JsonObject;
    begin
        WasteOrderJSONObject.ReadFrom(WasteOrderText);

        with WasteOrder do begin
            Init();
            WasteOrderJSONObject.Get('key', ValueJSONToken);
            "Key" := ValueJSONToken.AsValue().AsText();

            WasteOrderJSONObject.Get('status', ValueJSONToken);
            Status := ValueJSONToken.AsValue().AsOption();

            WasteOrderJSONObject.Get('subcontractorMSPID', ValueJSONToken);
            "Subcontractor MSP ID" := ValueJSONToken.AsValue().AsText();

            WasteOrderJSONObject.Get('originatorMSPID', ValueJSONToken);
            "Originator MSP ID" := ValueJSONToken.AsValue().AsText();

            WasteOrderJSONObject.Get('customerName', ValueJSONToken);
            "Customer Name" := ValueJSONToken.AsValue().AsText();

            WasteOrderJSONObject.Get('description', ValueJSONToken);
            Description := ValueJSONToken.AsValue().AsText();

            WasteOrderJSONObject.Get('quantity', ValueJSONToken);
            Quantity := ValueJSONToken.AsValue().AsDecimal();

            WasteOrderJSONObject.Get('unitPrice', ValueJSONToken);
            "Unit Price" := ValueJSONToken.AsValue().AsDecimal();

            WasteOrderJSONObject.Get('unitOfMeasure', ValueJSONToken);
            "Unit of Measure" := ValueJSONToken.AsValue().AsText();

            WasteOrderJSONObject.Get('taskDate', ValueJSONToken);
            Evaluate("Task Date", ValueJSONToken.AsValue().AsText());

            if WasteOrderJSONObject.Get('startingTime', ValueJSONToken) then
                Evaluate("Starting Time", ValueJSONToken.AsValue().AsText());

            if WasteOrderJSONObject.Get('finishingTime', ValueJSONToken) then
                Evaluate("Finishing Time", ValueJSONToken.AsValue().AsText());

            WasteOrderJSONObject.Get('referenceNo', ValueJSONToken);
            Evaluate("Reference No.", ValueJSONToken.AsValue().AsText());

            if WasteOrderJSONObject.Get('weighbridgeTicketNo', ValueJSONToken) then
                Evaluate("Weighbridge Ticket No.", ValueJSONToken.AsValue().AsText());

            WasteOrderJSONObject.Get('lastChanged', ValueJSONToken);
            Evaluate("Last Changed", ValueJSONToken.AsValue().AsText());

            WasteOrderJSONObject.Get('lastChangedByMSPID', ValueJSONToken);
            Evaluate("Last Changed By MSPID", ValueJSONToken.AsValue().AsText());

            // Task Site
            WasteOrderJSONObject.Get('taskSite', TaskSiteJSONToken);
            TaskSiteJSONObject := TaskSiteJSONToken.AsObject();

            TaskSiteJSONObject.Get('name', ValueJSONToken);
            "Task Site Name" := ValueJSONToken.AsValue().AsText();

            TaskSiteJSONObject.Get('name2', ValueJSONToken);
            "Task Site Name 2" := ValueJSONToken.AsValue().AsText();

            TaskSiteJSONObject.Get('address', ValueJSONToken);
            "Task Site Address" := ValueJSONToken.AsValue().AsText();

            TaskSiteJSONObject.Get('address2', ValueJSONToken);
            "Task Site Address 2" := ValueJSONToken.AsValue().AsText();

            TaskSiteJSONObject.Get('areaCode', ValueJSONToken);
            "Task Site Area Code" := ValueJSONToken.AsValue().AsText();

            TaskSiteJSONObject.Get('city', ValueJSONToken);
            "Task Site City" := ValueJSONToken.AsValue().AsText();

            TaskSiteJSONObject.Get('countryCode', ValueJSONToken);
            "Task Site Country Code" := ValueJSONToken.AsValue().AsText();

            TaskSiteJSONObject.Get('postCode', ValueJSONToken);
            "Task Site Post Code" := ValueJSONToken.AsValue().AsText();

            // Service
            WasteOrderJSONObject.Get('service', ServiceJSONToken);
            ServiceJSONObject := ServiceJSONToken.AsObject();

            ServiceJSONObject.Get('description', ValueJSONToken);
            "Service Description" := ValueJSONToken.AsValue().AsText();

            ServiceJSONObject.Get('description2', ValueJSONToken);
            "Service Description 2" := ValueJSONToken.AsValue().AsText();

            ServiceJSONObject.Get('materialDescription', ValueJSONToken);
            "Service Material Description" := ValueJSONToken.AsValue().AsText();

            ServiceJSONObject.Get('equipmentType', ValueJSONToken);
            "Service Equipment Type" := ValueJSONToken.AsValue().AsOption();

            ServiceJSONObject.Get('equipmentDescription', ValueJSONToken);
            "Service Equipment Description" := ValueJSONToken.AsValue().AsText();
        end;
    end;

    procedure GetUpdateWasteOrderStatusJSON(Status: enum "Waste Order Status WC"): JsonObject
    var
        UpdateWasteOrderStatusJSON: JsonObject;
    begin
        UpdateWasteOrderStatusJSON.Add('status', Status);
        exit(UpdateWasteOrderStatusJSON);
    end;
}