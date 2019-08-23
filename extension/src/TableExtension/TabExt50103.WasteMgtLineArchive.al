tableextension 50103 "Waste Mgt. Line Archive Ext WC" extends "Waste Mgt. Line Archive"
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