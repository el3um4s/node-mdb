import { getDataTypeDesc } from "../helpers/GetDataTypeDesc";

export const getSchemaOneTable = `
${getDataTypeDesc}

Function GetSchemaTable_One_CSV(objConnection, nameTable)
    Set objRecordSet = CreateObject("ADODB.Recordset")
    Dim sQuery
    sQuery = "SELECT * FROM " & "[" & nameTable & "]"

    Set objRecordset = objConnection.Execute(sQuery)
    strOutput = ""

    If IsObject( objRecordset ) Then
        If objRecordset.State = 1 Then
            strHeader = " name,type,desc" & vbCrLf
            For i = 0 To objRecordset.Fields.Count - 1
                strHeader = strHeader & objRecordset.Fields.Item(i).Name & "," & objRecordset.Fields.Item(i).Type & "," & GetDataTypeDesc(objRecordset.Fields.Item(i).Type) & vbCrLf
            Next
            strHeader = Mid(strHeader, 2)
        End If
    End If

    CloseRecordset(objRecordset)
    
    GetSchemaTable_One_CSV = strHeader
End Function

Function GetSchemaTable_One_JSON(objConnection, nameTable)
    Set objRecordSet = CreateObject("ADODB.Recordset")
    Dim sQuery
    sQuery = "SELECT * FROM " & "[" & nameTable & "]"
    Set objRecordset = objConnection.Execute(sQuery)
    strOutput = ""

    dim result
    result =  "{""result"":["
    If IsObject( objRecordset ) Then
        If objRecordset.State = 1 Then
            For i = 0 To objRecordset.Fields.Count - 1
                result = result & "{""" & "NAME" & """: " & """" & objRecordset.Fields.Item(i).Name & """," & """" & "TYPE" & """: " & """" & objRecordset.Fields.Item(i).Type & """," & """" & "DESC" & """: " & """" & GetDataTypeDesc(objRecordset.Fields.Item(i).Type) & """},"
            Next
        '    result = Left(result, Len(result) - 1)
        '    result = result & "},"
        '    result = Left(result, Len(result) - 1)
       End If
    End If

    result = Left(result, Len(result) - 1) & "]}"
    CloseRecordset(objRecordset)
    
    GetSchemaTable_One_JSON = result
End Function`;
