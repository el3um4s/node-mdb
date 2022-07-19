// c:\Windows\SysWOW64\cscript.exe .\api_query_sql.vbs adodb.mdb "SELECT id, [first name] FROM [Users];"  [JSON/CSV]

import { openConnection } from "./helpers/OpenConnection";
import { closeRecordset } from "./helpers/CloseRecordset";
import { generateConnectionString } from "./helpers/GenerateConnectionString";
import { closeConnection } from "./helpers/CloseConnection";

import { sql } from "./base/SQL";

export const api_sql = `
${openConnection}
${closeRecordset}
${generateConnectionString}
${closeConnection}

${sql}

Dim nameDatabase
nameDatabase = WScript.Arguments.Item(0)

Dim sQuery
sQuery = WScript.Arguments.Item(1)

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
    schema = SQL_CSV(objConnection, sQuery)
Else
    schema = SQL_JSON(objConnection, sQuery)
End if

Wscript.Echo schema
`;
