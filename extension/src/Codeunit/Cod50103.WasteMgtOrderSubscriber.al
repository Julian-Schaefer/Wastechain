codeunit 50103 "Waste Mgt. Order Subscriber WC"
{
    // [EventSubscriber(ObjectType::Codeunit, Codeunit::ReleaseManagement, 'OnBeforeOrderReleased', '', true, true)]
    // local procedure OnBeforeOrderReleasedCheckWastechain(WasteHeader: Record "Waste Management Header")
    // var
    //     WasteLine: Record "Waste Management Line";
    //     WasteOrder: Record "Waste Order WC";
    // begin
    //     with WasteLine do begin
    //         SetRange("Document Type", WasteHeader."Document Type");
    //         SetRange("Document No.", WasteHeader."No.");
    //         if FindSet(false, false) then
    //             repeat
    //                 if "Waste Order Key WC" <> '' then begin
    //                     WastechainMgt.GetWasteOrder("Waste Order Key WC", WasteOrder);

    //                     case "Posting Type" of
    //                         "Posting Type"::Purchase:
    //                             begin
    //                                 if WasteOrder.Status <> WasteOrder.Status::Completed then
    //                                     Error('Line %1 has a commissioned Waste Order which has not yet been completed by the Contrator.', "Line No.");
    //                             end;
    //                         "Posting Type"::Sales:
    //                             begin
    //                                 if WasteOrder.Status <> WasteOrder.Status::Accepted then
    //                                     Error('Line %1 has a commissioned Waste Order which can not be completed because it does not have the Status "Accepted".', "Line No.");
    //                             end;
    //                     end;
    //                 end;
    //             until Next() = 0;
    //     end;
    // end;

    // [EventSubscriber(ObjectType::Codeunit, Codeunit::ReleaseManagement, 'OnAfterOrderReleased', '', true, true)]
    // local procedure OnAfterOrderReleasedCheckWastechain(OriginalWasteHeader: Record "Waste Management Header"; var ReleasedWasteHeader: Record "Waste Management Header")
    // var
    //     WasteLine: Record "Waste Management Line";
    //     WasteOrder: Record "Waste Order WC";
    // begin
    //     with WasteLine do begin
    //         SetRange("Document Type", ReleasedWasteHeader."Document Type");
    //         SetRange("Document No.", ReleasedWasteHeader."No.");
    //         if FindSet(false, false) then
    //             repeat
    //                 if "Waste Order Key WC" <> '' then begin
    //                     WastechainMgt.GetWasteOrder("Waste Order Key WC", WasteOrder);

    //                     case "Posting Type" of
    //                         "Posting Type"::Sales:
    //                             begin
    //                                 WastechainMgt.CompleteWasteOrder("Waste Order Key WC");
    //                             end;
    //                     end;
    //                 end;
    //             until Next() = 0;
    //     end;
    // end;

    var
        WastechainMgt: Codeunit "Wastechain Management";
}