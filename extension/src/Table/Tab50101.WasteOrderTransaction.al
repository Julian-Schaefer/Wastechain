table 50101 "Waste Order Transaction WC"
{
    DataClassification = CustomerContent;

    fields
    {
        field(1; "Transaction ID"; Text[250])
        {
            Caption = 'Transaction ID';
        }

        field(2; "Transaction Timestamp"; Text[250])
        {
            Caption = 'Transaction Timestamp';
        }

        field(3; Status; enum "Waste Order Status WC")
        {
            Caption = 'Status';
        }

        field(4; Quantity; Decimal)
        {
            Caption = 'Quantity';
        }

        field(5; "Unit Price"; Decimal)
        {
            Caption = 'Unit Price';
        }

        field(6; "Last Changed"; Text[100])
        {
            Caption = 'Last Changed';
            DataClassification = ToBeClassified;
        }

        field(7; "Last Changed By MSPID"; Text[100])
        {
            Caption = 'Last Changed By MSPID';
            DataClassification = ToBeClassified;
        }
    }

    keys
    {
        key(PK; "Transaction ID")
        {
            Clustered = true;
        }
    }
}