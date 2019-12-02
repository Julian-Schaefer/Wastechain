codeunit 50103 "Waste Mgt. Order Subscriber WC"
{
    [EventSubscriber(ObjectType::Codeunit, Codeunit::"ReleaseManagement WMR", 'OnBeforeOrderReleased', '', true, true)]
    local procedure OnBeforeOrderReleasedCheckWastechain(WasteHeader: Record "Waste Management Header WMR")
    var
        WasteMgtLine: Record "Waste Management Line WMR";
        WasteOrder: Record "Waste Order WC";
    begin
        with WasteMgtLine do begin
            SetRange("Document Type", WasteHeader."Document Type");
            SetRange("Document No.", WasteHeader."No.");
            if FindSet(false, false) then
                repeat
                    if "Waste Order ID WC" <> '' then begin
                        WastechainMgt.GetWasteOrder("Waste Order ID WC", WasteOrder);

                        case "Posting Type" of
                            "Posting Type"::Purchase:
                                begin
                                    if WasteOrder.Status <> WasteOrder.Status::Completed then
                                        Error('Line %1 has a commissioned Waste Order which has not yet been completed by the Contrator.', "Line No.");
                                end;
                            "Posting Type"::Sales:
                                begin
                                    if WasteOrder.Status <> WasteOrder.Status::Accepted then
                                        Error('Line %1 has a commissioned Waste Order which can not be completed because it does not have the Status "Accepted".', "Line No.");
                                end;
                        end;
                    end;
                until Next() = 0;
        end;
    end;

    [EventSubscriber(ObjectType::Codeunit, Codeunit::"ReleaseManagement WMR", 'OnAfterOrderReleased', '', true, true)]
    local procedure OnAfterOrderReleasedCheckWastechain(OriginalWasteHeader: Record "Waste Management Header WMR"; var ReleasedWasteHeader: Record "Waste Management Header WMR")
    var
        WasteMgtLine: Record "Waste Management Line WMR";
    begin
        with WasteMgtLine do begin
            SetRange("Document Type", ReleasedWasteHeader."Document Type");
            SetRange("Document No.", ReleasedWasteHeader."No.");
            if FindSet(false, false) then
                repeat
                    if "Waste Order ID WC" <> '' then begin
                        case "Posting Type" of
                            "Posting Type"::Sales:
                                begin
                                    WastechainMgt.CompleteWasteOrder(WasteMgtLine);
                                end;
                        end;
                    end;
                until Next() = 0;
        end;
    end;

    var
        WastechainMgt: Codeunit "Wastechain Management";
}