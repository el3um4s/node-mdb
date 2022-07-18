//  c:\Windows\SysWOW64\cscript.exe .\api_schema.vbs adodb.mdb [JSON/CSV]

import { openConnection } from "./helpers/OpenConnection";
import { closeRecordset } from "./helpers/CloseRecordset";
import { generateConnectionString } from "./helpers/GenerateConnectionString";
import { closeConnection } from "./helpers/CloseConnection";

export const api_schema = `
${openConnection}
${closeRecordset}
${generateConnectionString}
${closeConnection}

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

Dim nameDatabase
nameDatabase = WScript.Arguments.Item(0)

Dim format
format = "JSON"  'CSV - JSON

If Wscript.Arguments.Unnamed.Count = 2 then
	format = WScript.Arguments.Item(1) 'CSV - JSON
End If

Dim sConnectionString
sConnectionString = GenerateConnectionString(nameDatabase)

Set objConnection = CreateObject("ADODB.Connection")
objConnection.Open(sConnectionString)

dim schema

If UCase(format) = "CSV" then
    schema = GetSchemaTables_All_CSV(objConnection)
Else
    schema = GetSchemaTables_All_JSON(objConnection)
End if

Wscript.Echo schema`;
