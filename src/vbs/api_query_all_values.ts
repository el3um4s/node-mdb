// c:\Windows\SysWOW64\cscript.exe .\api_query_all_values.vbs adodb.mdb users [JSON/CSV]

import { openConnection } from "./helpers/OpenConnection";
import { closeRecordset } from "./helpers/CloseRecordset";
import { generateConnectionString } from "./helpers/GenerateConnectionString";
import { closeConnection } from "./helpers/CloseConnection";

export const api_query_all_values = `
${openConnection}
${closeRecordset}
${generateConnectionString}
${closeConnection}

Function GetAllValue_CSV(objConnection, nameTable)
    Set objRecordSet = CreateObject("ADODB.Recordset")
    Dim sQuery
    sQuery = "SELECT * FROM " & "[" & nameTable & "]"
    Set objRecordset = objConnection.Execute(sQuery)
    strOutput = ""

    If IsObject( objRecordset ) Then
        If objRecordset.State = 1 Then
            Do While Not objRecordset.EOF
                ' Create a header line with the column names and data types
                strHeader = ""
                For i = 0 To objRecordset.Fields.Count - 1
                    strHeader = strHeader & ",""" & objRecordset.Fields.Item(i).Name & """"
                Next
                strHeader = Mid(strHeader, 2)
                ' List the fields of the current record in comma delimited format
                strResult = ""
                For i = 0 To objRecordset.Fields.Count - 1
                    strResult = strResult & ",""" & objRecordset.Fields.Item(i).Value & """"
                Next
                ' Add the current record to the output string
                strOutput = strOutput & Mid( strResult, 2 ) & vbCrLf
                objRecordset.MoveNext
            Loop
        End If
    End If

    CloseRecordset(objRecordset)
    dim result
    result = strHeader & vbCrLf & strOutput & vbCrLf
    GetAllValue_CSV = result
End Function

Function GetAllValue_JSON(objConnection, nameTable)
    Set objRecordSet = CreateObject("ADODB.Recordset")
    Dim sQuery
    sQuery = "SELECT * FROM " & "[" & nameTable & "]"
    Set objRecordset = objConnection.Execute(sQuery)
    strOutput = ""

    dim result
    result =  "{""result"":["
    If IsObject( objRecordset ) Then
        If objRecordset.State = 1 Then

            Do Until objRecordset.EOF
                result = result & "{"
                For i = 0 To objRecordset.Fields.Count - 1
                    result = result & """" & objRecordset.Fields.Item(i).Name & """: " & """" & objRecordset.Fields.Item(i).Value & ""","
                Next
                result = Left(result, Len(result) - 1)
                result = result & "},"
                objRecordset.MoveNext
            Loop
            result = Left(result, Len(result) - 1)
       End If
    End If

    result = result & "]}"
    CloseRecordset(objRecordset)
    
    GetAllValue_JSON = result
End Function

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
    schema = GetAllValue_CSV(objConnection, nameTable)
Else
    schema = GetAllValue_JSON(objConnection, nameTable)
End if

Wscript.Echo schema`;
