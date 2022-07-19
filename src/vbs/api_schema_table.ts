// c:\Windows\SysWOW64\cscript.exe .\api_query_all_values.vbs adodb.mdb users [JSON/CSV]

import { openConnection } from "./helpers/OpenConnection";
import { closeRecordset } from "./helpers/CloseRecordset";
import { generateConnectionString } from "./helpers/GenerateConnectionString";
import { closeConnection } from "./helpers/CloseConnection";

import { getSchemaOneTable } from "./base/GetSchemaOneTable";

export const api_schema_table = `
${openConnection}
${closeRecordset}
${generateConnectionString}
${closeConnection}

${getSchemaOneTable}

Dim nameDatabase
nameDatabase = WScript.Arguments.Item(0)

Dim nameTable
nameTable = WScript.Arguments.Item(1)

Dim format
format = "JSON"  'CSV - JSON

If Wscript.Arguments.Unnamed.Count = 3 then
	format = WScript.Arguments.Item(2) 'CSV - JSON
End If

Dim sConnectionString
sConnectionString = GenerateConnectionString(nameDatabase)

Set objConnection = CreateObject("ADODB.Connection")
objConnection.Open(sConnectionString)

dim schema

If UCase(format) = "CSV" then
    schema = GetSchemaTable_One_CSV(objConnection, nameTable)
Else
    schema = GetSchemaTable_One_JSON(objConnection, nameTable)
End if

Wscript.Echo schema`;
