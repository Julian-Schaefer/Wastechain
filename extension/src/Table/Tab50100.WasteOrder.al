table 50100 "Waste Order WC"
{
    DataClassification = CustomerContent;

    fields
    {
        field(1; Id; Guid)
        {

        }

        field(2; Description; Text[250])
        {

        }

        field(3; Address; Text[250])
        {

        }
    }

    keys
    {
        key(PK; Id)
        {
            Clustered = true;
        }
    }

    trigger OnInsert()
    begin
        Id := CreateGuid();
    end;

    procedure ConvertToJSON(): JsonObject
    var
        RecRef: RecordRef;
        Field: Record Field;
        JSON: JsonObject;
    begin
        RecRef.GetTable(Rec);

        Field.SetRange(TableNo, Database::"Waste Order WC");
        if Field.FindSet(false, false) then
            repeat
                JSON.Add(Field.FieldName, Format(RecRef.Field(Field."No.").Value));
            until Field.Next() = 0;

        exit(JSON);
    end;
}