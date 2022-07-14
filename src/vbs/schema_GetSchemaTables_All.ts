import { db_CloseRecordset } from "./db_CloseRecordset";

export const schema_GetSchemaTables_All = `
${db_CloseRecordset}

Function GetSchemaTables_All_CSV(objConnection)
    Set objRecordSet = CreateObject("ADODB.Recordset")
    Set objRecordSet = objConnection.OpenSchema(20)
    Dim result
    result = "TABLE_NAME | TABLE_TYPE" & vbCrLf
    Do Until objRecordset.EOF
         result = result & objRecordset.Fields.Item("TABLE_NAME") & " | " & objRecordset.Fields.Item("TABLE_TYPE") & vbCrLf
        objRecordset.MoveNext
    Loop
    CloseRecordset(objRecordset)
    GetSchemaTables_All_CSV = result
End Function

Function GetSchemaTables_All_JSON(objConnection)
    Set objRecordSet = CreateObject("ADODB.Recordset")
    Set objRecordSet = objConnection.OpenSchema(20)
    Dim result
    result = "{""schema"":["
    Do Until objRecordset.EOF
        result = result & "{""TABLE_NAME"":" & """" & objRecordset.Fields.Item("TABLE_NAME") & ""","
        result = result & """TABLE_TYPE"":" & """" & objRecordset.Fields.Item("TABLE_TYPE") & """},"
        objRecordset.MoveNext
    Loop
    CloseRecordset(objRecordset)
    result = Left(result, Len(result) - 1)
    GetSchemaTables_All_JSON = result & "]}"
End Function
`;
