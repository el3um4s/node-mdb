' c:\Windows\SysWOW64\cscript.exe .\api_schema.vbs adodb.mdb [JSON/CSV]


Function OpenConnection(sConnectionString)
    Set objConnection = CreateObject("ADODB.Connection")
    OpenConnection = objConnection.Open(sConnectionString)
End Function

Sub CloseRecordset(objRecordset)
     If objRecordset.State = 1 Then
        objRecordset.Close
    End If
End Sub

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

Sub Include (strFile)
    scriptdir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
    Set objFSO = CreateObject("Scripting.FileSystemObject")
    Dim filePosition
    filePosition = scriptdir & "/" & strFile
	Set objTextFile = objFSO.OpenTextFile(filePosition, 1)
	ExecuteGlobal objTextFile.ReadAll
	objTextFile.Close
	Set objFSO = Nothing
	Set objTextFile = Nothing
End Sub

Sub CloseConnection(objConnection)
    objConnection.Close
End Sub

Function GenerateConnectionString(nameDatabase)
    GenerateConnectionString = "NONE"
    Dim ext
    ext = DatabaseExstension(nameDatabase)
    
    If ext = "MDB" then
        GenerateConnectionString = Replace("Provider=Microsoft.Jet.OLEDB.4.0;Data Source='NAMEDATABASE';","NAMEDATABASE",nameDatabase) 
    End If

    If ext = "ACCDB" then
        GenerateConnectionString = Replace("Provider=Microsoft.ACE.OLEDB.12.0;Data Source='NAMEDATABASE';Persist Security Info=False;","NAMEDATABASE",nameDatabase)
    End If

End Function

Function DatabaseExstension(nameDatabase)
    dim ext
    ext = "NONE"
    If Right(UCase(nameDatabase), 4) = ".MDB" then
        ext = "MDB"
    End If
    If Right(UCase(nameDatabase), 6) = ".ACCDB" then
        ext = "ACCDB"
    End If
    DatabaseExstension = ext
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

Wscript.Echo schema