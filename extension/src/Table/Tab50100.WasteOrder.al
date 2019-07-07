table 50100 "Waste Order WC"
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

        field(3; Quantity; Decimal)
        {
            Caption = 'Quantity';
        }

        field(4; "Unit Price"; Decimal)
        {
            Caption = 'Unit Price';
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