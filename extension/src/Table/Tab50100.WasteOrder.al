enum 50100 "Waste Order Status WC"
{
    Extensible = true;

    value(0; Commissioned)
    {
        Caption = 'Commissioned';
    }

    value(1; Accepted)
    {
        Caption = 'Accepted';
    }

    value(2; Rejected)
    {
        Caption = 'Rejected';
    }

    value(3; Cancelled)
    {
        Caption = 'Cancelled';
    }
}

table 50100 "Waste Order Transaction WC"
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
    }

    keys
    {
        key(PK; "Transaction ID")
        {
            Clustered = true;
        }
    }
}