//  c:\Windows\SysWOW64\cscript.exe .\api_schema.vbs adodb.mdb [JSON/CSV]

import { openConnection } from "./helpers/OpenConnection";
import { closeRecordset } from "./helpers/CloseRecordset";
import { generateConnectionString } from "./helpers/GenerateConnectionString";
import { closeConnection } from "./helpers/CloseConnection";

import { getSchemaTables } from "./base/GetSchemaTables";

export const api_schema = `
${openConnection}
${closeRecordset}
${generateConnectionString}
${closeConnection}

${getSchemaTables}

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
