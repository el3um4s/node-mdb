' c:\Windows\SysWOW64\cscript.exe .\api_query_all_values.vbs adodb.mdb users [JSON/CSV]

Function OpenConnection(sConnectionString)
    Set objConnection = CreateObject("ADODB.Connection")
    OpenConnection = objConnection.Open(sConnectionString)
End Function

Sub CloseRecordset(objRecordset)
     If objRecordset.State = 1 Then
        objRecordset.Close
    End If
End Sub

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


Function SQL_CSV(objConnection, sQuery)
    Set objRecordSet = CreateObject("ADODB.Recordset")
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
    SQL_CSV = result
End Function

Function SQL_JSON(objConnection, sQuery)
    Set objRecordSet = CreateObject("ADODB.Recordset")
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
    
    SQL_JSON = result
End Function

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

Wscript.Echo schema