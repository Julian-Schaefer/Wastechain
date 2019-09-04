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

        field(6; "Unit of Measure"; Text[250])
        {
            Caption = 'Unit of Measure';
        }

        field(10; "Task Date"; Date)
        {
            Caption = 'Task Date';
            DataClassification = ToBeClassified;
        }

        field(11; "Starting Time"; Time)
        {
            Caption = 'Starting Time';
        }

        field(12; "Finishing Time"; Time)
        {
            Caption = 'Finishing Time';
        }

        field(20; "Rejection Message"; Text[250])
        {
            Caption = 'Rejection Message';
        }

        field(50; "Last Changed"; Text[100])
        {
            Caption = 'Last Changed';
        }

        field(51; "Last Changed By MSPID"; Text[100])
        {
            Caption = 'Last Changed By MSPID';
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