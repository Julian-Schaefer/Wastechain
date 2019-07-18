table 50102 "Wastechain Setup WC"
{
    Caption = 'Wastechain Setup';
    DataClassification = CustomerContent;

    fields
    {
        field(1; "Primary Key"; Code[10])
        {
            DataClassification = ToBeClassified;
        }

        field(2; "API URL"; Text[250])
        {
            DataClassification = CustomerContent;

            trigger OnValidate()
            begin
                if CopyStr("API URL", StrLen("API URL")) = '/' then
                    Error('Please remove the trailing ''/''.');
            end;
        }
    }

    keys
    {
        key(PK; "Primary Key")
        {
            Clustered = true;
        }
    }
}