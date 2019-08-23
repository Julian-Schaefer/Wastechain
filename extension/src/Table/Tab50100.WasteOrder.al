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

    value(4; Completed)
    {
        Caption = 'Completed';
    }
}

table 50100 "Waste Order WC"
{
    DataClassification = ToBeClassified;

    fields
    {
        field(1; "ID"; Text[250])
        {
            Caption = 'ID';
            DataClassification = ToBeClassified;
        }

        field(2; Status; enum "Waste Order Status WC")
        {
            Caption = 'Status';
            DataClassification = ToBeClassified;
        }

        field(3; "Subcontractor MSP ID"; Text[100])
        {
            Caption = 'Contractor MSP ID';
            DataClassification = ToBeClassified;
        }

        field(4; "Originator MSP ID"; Text[100])
        {
            Caption = 'Originator MSP ID';
            DataClassification = ToBeClassified;
        }

        field(5; "Customer Name"; Text[250])
        {
            Caption = 'Customer Name';
            DataClassification = ToBeClassified;
        }

        field(6; Description; Text[250])
        {
            Caption = 'Description';
            DataClassification = ToBeClassified;
        }

        field(7; Quantity; Decimal)
        {
            Caption = 'Quantity';
            DataClassification = ToBeClassified;
        }

        field(8; "Unit Price"; Decimal)
        {
            Caption = 'Unit Price';
            DataClassification = ToBeClassified;
        }

        field(9; "Unit of Measure"; Text[50])
        {
            Caption = 'Unit of Measure';
            DataClassification = ToBeClassified;
        }

        field(10; "Task Date"; Date)
        {
            Caption = 'Task Date';
            DataClassification = ToBeClassified;
        }

        field(11; "Starting Time"; Time)
        {
            Caption = 'Starting Time';
            DataClassification = ToBeClassified;
        }

        field(12; "Finishing Time"; Time)
        {
            Caption = 'Finishing Time';
            DataClassification = ToBeClassified;
        }

        field(13; "Reference No."; Text[100])
        {
            Caption = 'Reference No.';
            DataClassification = ToBeClassified;
        }

        field(14; "Weighbridge Ticket No."; Code[20])
        {
            Caption = 'Weighbridge Ticket No.';
            DataClassification = ToBeClassified;
        }

        field(15; "Last Changed"; Text[100])
        {
            Caption = 'Last Changed';
            DataClassification = ToBeClassified;
        }

        field(16; "Last Changed By MSPID"; Text[100])
        {
            Caption = 'Last Changed By MSPID';
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

        field(22; "Service Material Description"; Text[250])
        {
            Caption = 'Service Material Description';
            DataClassification = ToBeClassified;
        }

        field(23; "Service Equipment Type"; Option)
        {
            Caption = 'Equipment Type';
            OptionCaption = ' ,Submission,Pick-up,Exchange,Clearance,Purchase (Stock),Sales (Stock)';
            OptionMembers = " ",Submission,"Pick-up",Exchange,Clearance,"Purchase (Stock)","Sales (Stock)";
            DataClassification = ToBeClassified;
        }

        field(24; "Service Equipment Description"; Text[250])
        {
            Caption = 'Service Equipment Description';
            DataClassification = ToBeClassified;
        }

        field(30; "Task Site Name"; Text[250])
        {
            Caption = 'Task Site Name';
            DataClassification = ToBeClassified;
        }

        field(31; "Task Site Name 2"; Text[250])
        {
            Caption = 'Task Site Name 2';
            DataClassification = ToBeClassified;
        }

        field(32; "Task Site Address"; Text[250])
        {
            Caption = 'Task Site Address';
            DataClassification = ToBeClassified;
        }

        field(33; "Task Site Address 2"; Text[250])
        {
            Caption = 'Task Site Address 2';
            DataClassification = ToBeClassified;
        }

        field(34; "Task Site Post Code"; Text[50])
        {
            Caption = 'Task Site Post Code';
            DataClassification = ToBeClassified;
        }

        field(35; "Task Site City"; Text[250])
        {
            Caption = 'Task Site City';
            DataClassification = ToBeClassified;
        }

        field(36; "Task Site Country Code"; Text[20])
        {
            Caption = 'Task Site Country Code';
            DataClassification = ToBeClassified;
        }

        field(37; "Task Site Area Code"; Text[50])
        {
            Caption = 'Task Site Area Code';
            DataClassification = ToBeClassified;
        }
    }

    keys
    {
        key(PK; "ID")
        {
            Clustered = true;
        }
    }
}