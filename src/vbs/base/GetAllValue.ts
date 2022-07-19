export const getAllValue = `
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
End Function`;
