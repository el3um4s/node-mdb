export const db_CloseRecordset = `
Sub CloseRecordset(objRecordset)
     If objRecordset.State = 1 Then
        objRecordset.Close
    End If
End Sub`;
