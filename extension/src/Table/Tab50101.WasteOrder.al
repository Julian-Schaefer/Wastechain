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

table 50100 "Waste Order WC"
{
    DataClassification = ToBeClassified;

    fields
    {
        field(1; "Key"; Text[250])
        {
            Caption = 'Key';
            DataClassification = ToBeClassified;
        }

        field(2; Status; enum "Waste Order Status WC")
        {
            Caption = 'Status';
            DataClassification = ToBeClassified;
        }

        field(3; Description; Text[250])
        {
            Caption = 'Description';
            DataClassification = ToBeClassified;
        }

        field(4; Quantity; Decimal)
        {
            Caption = 'Quantity';
            DataClassification = ToBeClassified;
        }

        field(5; "Unit Price"; Decimal)
        {
            Caption = 'Unit Price';
            DataClassification = ToBeClassified;
        }

        field(6; "Originator MSP ID"; Text[250])
        {
            Caption = 'Originator MSP ID';
            DataClassification = ToBeClassified;
        }

        field(7; "Contractor MSP ID"; Text[250])
        {
            Caption = 'Originator MSP ID';
            DataClassification = ToBeClassified;
        }

        field(20; "Service Description"; Text[250])
        {
            Caption = 'Service Description';
            DataClassification = ToBeClassified;
        }

        field(21; "Service Description 2"; Text[250])
        {
            Caption = 'Service Description 2';
            DataClassification = ToBeClassified;
        }

        field(30; "Task Site Address"; Text[250])
        {
            Caption = 'Task Site Address';
            DataClassification = ToBeClassified;
        }

        field(31; "Task Site Address 2"; Text[250])
        {
            Caption = 'Task Site Address 2';
            DataClassification = ToBeClassified;
        }

        field(32; "Task Site Post Code"; Text[50])
        {
            Caption = 'Task Site Post Code';
            DataClassification = ToBeClassified;
        }

        field(33; "Task Site City"; Text[250])
        {
            Caption = 'Task Site City';
            DataClassification = ToBeClassified;
        }

        field(34; "Task Site Country Code"; Text[20])
        {
            Caption = 'Task Site Country Code';
            DataClassification = ToBeClassified;
        }

        field(35; "Task Site Area Code"; Text[50])
        {
            Caption = 'Task Site Area Code';
            DataClassification = ToBeClassified;
        }
    }

    keys
    {
        key(PK; "Key")
        {
            Clustered = true;
        }
    }
}