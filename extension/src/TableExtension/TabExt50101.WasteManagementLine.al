tableextension 50101 "Waste Management Line Ext WC" extends "Waste Management Line"
{
    fields
    {
        field(50100; "Waste Order ID WC"; Text[250])
        {
            Caption = 'Waste Order ID';
            DataClassification = CustomerContent;
        }
    }
}