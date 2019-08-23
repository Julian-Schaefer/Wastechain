import 'package:wastechain_mobile/wasteOrder/Service.dart';
import 'package:wastechain_mobile/wasteOrder/TaskSite.dart';

class WasteOrder {
  final String id;
  final int status;
  final String subcontractorMSPID;
  final String originatorMSPID;
  final String customerName;
  final TaskSite taskSite;
  final Service service;
  final String description;
  final double quantity;
  final double unitPrice;
  final String unitOfMeasure;
  final String taskDate;
  final String startingTime;
  final String finishingTime;
  final String referenceNo;
  final String rejectionMessage;
  final String lastChanged;
  final String lastChangedByMSPID;

  WasteOrder(
      {this.id,
      this.status,
      this.subcontractorMSPID,
      this.originatorMSPID,
      this.customerName,
      this.taskSite,
      this.service,
      this.description,
      this.quantity,
      this.unitPrice,
      this.unitOfMeasure,
      this.taskDate,
      this.startingTime,
      this.finishingTime,
      this.referenceNo,
      this.rejectionMessage,
      this.lastChanged,
      this.lastChangedByMSPID});

  factory WasteOrder.fromJSON(Map<String, dynamic> json) {
    return WasteOrder(
      id: json['id'],
      status: json['status'],
      subcontractorMSPID: json['subcontractorMSPID'],
      originatorMSPID: json['originatorMSPID'],
      customerName: json['customerName'],
      taskSite: TaskSite.fromJSON(json['taskSite']),
      service: Service.fromJSON(json['service']),
      description: json['description'],
      quantity: json['quantity'].toDouble(),
      unitPrice: json['unitPrice'].toDouble(),
      unitOfMeasure: json['unitOfMeasure'],
      taskDate: json['taskDate'],
      startingTime: json['startingTime'],
      finishingTime: json['finishingTime'],
      referenceNo: json['referenceNo'],
      rejectionMessage: json['rejectionMessage'],
      lastChanged: json['lastChanged'],
      lastChangedByMSPID: json['lastChangedByMSPID'],
    );
  }
}
