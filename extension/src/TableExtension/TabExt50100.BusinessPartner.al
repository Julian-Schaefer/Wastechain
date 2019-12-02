tableextension 50100 "Business Partner Ext WC" extends "Business Partner WMR"
{
    fields
    {
        field(50100; "Wastechain MSP ID"; Text[250])
        {
            Caption = 'Wastechain MSP ID';
            DataClassification = CustomerContent;

            trigger OnValidate()
            var
                BusinessPartner: Record "Business Partner WMR";
                MSPIDAlreadyDefinedErr: Label 'This MSP ID has already been specified for %1 %2';
            begin
                if BusinessPartner.Get("Wastechain MSP ID") then
                    Error(MSPIDAlreadyDefinedErr, TableCaption(), BusinessPartner."No.");
            end;
        }
    }
}