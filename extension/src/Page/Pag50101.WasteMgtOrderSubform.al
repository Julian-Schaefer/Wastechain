pageextension 50102 "Waste Mgt Order Subform Ext WC" extends "Waste Mgt Order Subform"
{
    actions
    {
        addlast(processing)
        {
            group(Wastechain)
            {
                action("Submit to Wastechain")
                {
                    Caption = 'Submit to Wastechain';

                    trigger OnAction()
                    var
                        WastechainMgt: Codeunit "Wastechain Management";
                    begin
                        WastechainMgt.PostWasteOrder(Rec);
                    end;
                }
            }
        }
    }
}